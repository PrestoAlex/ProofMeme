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
const GLOBAL_TIP_COUNT_POINTER = Blockchain.nextPointer;
const MEME_TIPS_BASE_POINTER = Blockchain.nextPointer;
const MEME_TIP_COUNT_BASE_POINTER = Blockchain.nextPointer;

export class MemeTipper extends OP_NET {
  private totalTips: StoredU256;
  private globalTipCount: StoredU256;

  constructor() {
    super();
    this.totalTips = new StoredU256(TOTAL_TIPS_POINTER, EMPTY_POINTER);
    this.globalTipCount = new StoredU256(GLOBAL_TIP_COUNT_POINTER, EMPTY_POINTER);
  }

  public onDeployment(_calldata: Calldata): void {
    this.totalTips.set(u256.Zero);
    this.globalTipCount.set(u256.Zero);
  }

  @method('tipMeme')
  public tipMeme(calldata: Calldata): BytesWriter {
    const memeId = calldata.readU256();
    const tipAmount = calldata.readU256();
    const memeIndex = <u16>memeId.toU32();

    if (u256.eq(tipAmount, u256.Zero)) {
      throw new Revert('Tip amount must be greater than zero');
    }

    this.totalTips.set(SafeMath.add(this.totalTips.value, tipAmount));
    this.globalTipCount.set(SafeMath.add(this.globalTipCount.value, u256.One));

    const memeTipsPointer = MEME_TIPS_BASE_POINTER + memeIndex;
    const memeTipCountPointer = MEME_TIP_COUNT_BASE_POINTER + memeIndex;

    const memeTips = new StoredU256(memeTipsPointer, EMPTY_POINTER);
    const memeTipCount = new StoredU256(memeTipCountPointer, EMPTY_POINTER);

    memeTips.set(SafeMath.add(memeTips.value, tipAmount));
    memeTipCount.set(SafeMath.add(memeTipCount.value, u256.One));

    const writer = new BytesWriter(U256_BYTE_LENGTH * 2);
    writer.writeU256(memeTips.value);
    writer.writeU256(memeTipCount.value);
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
    const memeIndex = <u16>memeId.toU32();
    const memeTipsPointer = MEME_TIPS_BASE_POINTER + memeIndex;
    const memeTips = new StoredU256(memeTipsPointer, EMPTY_POINTER);

    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(memeTips.value);
    return writer;
  }

  @method('getMemeTipCount')
  public getMemeTipCount(calldata: Calldata): BytesWriter {
    const memeId = calldata.readU256();
    const memeIndex = <u16>memeId.toU32();
    const memeTipCountPointer = MEME_TIP_COUNT_BASE_POINTER + memeIndex;
    const memeTipCount = new StoredU256(memeTipCountPointer, EMPTY_POINTER);

    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(memeTipCount.value);
    return writer;
  }

  @method('getGlobalTipCount')
  public getGlobalTipCount(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.globalTipCount.value);
    return writer;
  }
}
