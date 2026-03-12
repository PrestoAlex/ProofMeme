import { u256 } from '@btc-vision/as-bignum/assembly';
import {
  Blockchain,
  BytesWriter,
  Calldata,
  EMPTY_POINTER,
  OP_NET,
  Revert,
  StoredU256,
  U256_BYTE_LENGTH,
  SafeMath,
} from '@btc-vision/btc-runtime/runtime';

const TOTAL_TIPS_POINTER = Blockchain.nextPointer;
const TIP_COUNT_POINTER = Blockchain.nextPointer;
const MEME_TIPS_POINTER = Blockchain.nextPointer;
const USER_TIPS_POINTER = Blockchain.nextPointer;

export class MemeTipperEnhanced extends OP_NET {
  private totalTips: StoredU256;
  private tipCount: StoredU256;
  private memeTips: StoredU256;
  private userTips: StoredU256;

  constructor() {
    super();
    this.totalTips = new StoredU256(TOTAL_TIPS_POINTER, EMPTY_POINTER);
    this.tipCount = new StoredU256(TIP_COUNT_POINTER, EMPTY_POINTER);
    this.memeTips = new StoredU256(MEME_TIPS_POINTER, EMPTY_POINTER);
    this.userTips = new StoredU256(USER_TIPS_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.totalTips.set(u256.Zero);
    this.tipCount.set(u256.Zero);
    this.memeTips.set(u256.Zero);
    this.userTips.set(u256.Zero);
  }

  @method('tipMeme')
  public tipMeme(calldata: Calldata): BytesWriter {
    const memeId = calldata.readU256();
    const tipAmount = calldata.readU256();
    const tipper = calldata.readU256();
    const memeCreator = calldata.readU256();

    // Validate tip amount
    if (tipAmount == u256.Zero) {
      throw new Revert('Tip amount must be greater than 0');
    }

    // Update totals
    this.totalTips.set(SafeMath.add(this.totalTips.value, tipAmount));
    this.tipCount.set(SafeMath.add(this.tipCount.value, u256.One));

    // Update meme-specific tips (using memeId as offset)
    const memeTipPointer = MEME_TIPS_POINTER + memeId;
    const currentMemeTips = new StoredU256(memeTipPointer, EMPTY_POINTER);
    currentMemeTips.set(SafeMath.add(currentMemeTips.value, tipAmount));

    // Update user-specific tips (using tipper hash as offset)
    const userTipHash = this.hashU256(tipper);
    const userTipPointer = USER_TIPS_POINTER + userTipHash;
    const currentUserTips = new StoredU256(userTipPointer, EMPTY_POINTER);
    currentUserTips.set(SafeMath.add(currentUserTips.value, tipAmount));

    // Calculate and distribute royalties (5% to meme creator)
    const royaltyAmount = SafeMath.div(SafeMath.mul(tipAmount, u256.from(500)), u256.from(10000));
    
    const writer = new BytesWriter(U256_BYTE_LENGTH * 4);
    writer.writeU256(tipAmount);
    writer.writeU256(royaltyAmount);
    writer.writeU256(currentMemeTips.value);
    writer.writeU256(currentUserTips.value);
    return writer;
  }

  @method('getTotalTips')
  public getTotalTips(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.totalTips.value);
    return writer;
  }

  @method('getMemeTips')
  public getMemeTips(calldata: Calldata): BytesWriter {
    const memeId = calldata.readU256();
    const memeTipPointer = MEME_TIPS_POINTER + memeId;
    const memeTips = new StoredU256(memeTipPointer, EMPTY_POINTER);
    
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(memeTips.value);
    return writer;
  }

  @method('getUserTips')
  public getUserTips(calldata: Calldata): BytesWriter {
    const user = calldata.readU256();
    const userTipHash = this.hashU256(user);
    const userTipPointer = USER_TIPS_POINTER + userTipHash;
    const userTips = new StoredU256(userTipPointer, EMPTY_POINTER);
    
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(userTips.value);
    return writer;
  }

  @method('getTipStats')
  public getTipStats(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH * 2);
    writer.writeU256(this.totalTips.value);
    writer.writeU256(this.tipCount.value);
    return writer;
  }

  private hashU256(value: u256): u256 {
    // Simple hash function for u256
    return SafeMath.add(SafeMath.mul(value, u256.from(31)), u256.from(17));
  }
}
