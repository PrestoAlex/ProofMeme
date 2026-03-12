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

export class MemeTipperWorking extends OP_NET {
  private totalTips: StoredU256;
  private tipCount: StoredU256;

  constructor() {
    super();
    this.totalTips = new StoredU256(TOTAL_TIPS_POINTER, EMPTY_POINTER);
    this.tipCount = new StoredU256(TIP_COUNT_POINTER, EMPTY_POINTER);
  }

  public onDeployment(_calldata: Calldata): void {
    this.totalTips.set(u256.Zero);
    this.tipCount.set(u256.Zero);
  }

  @method('tipMeme')
  public tipMeme(calldata: Calldata): BytesWriter {
    const tipAmount = calldata.readU256();
    
    // Validate tip amount
    if (u256.eq(tipAmount, u256.Zero)) {
      throw new Revert('Tip amount must be greater than zero');
    }

    // Update statistics
    this.totalTips.set(SafeMath.add(this.totalTips.value, tipAmount));
    this.tipCount.set(SafeMath.add(this.tipCount.value, u256.One));

    // Return tip count and amount
    const writer = new BytesWriter(U256_BYTE_LENGTH * 2);
    writer.writeU256(this.tipCount.value);
    writer.writeU256(tipAmount);
    return writer;
  }

  @method('getTotalTips')
  public getTotalTips(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.totalTips.value);
    return writer;
  }

  @method('getTipCount')
  public getTipCount(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.tipCount.value);
    return writer;
  }
}
