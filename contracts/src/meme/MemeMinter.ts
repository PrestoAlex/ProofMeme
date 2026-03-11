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

const TOTAL_MEMES_POINTER = Blockchain.nextPointer;
const MEME_COUNT_POINTER = Blockchain.nextPointer;

export class MemeMinter extends OP_NET {
  private totalMemes: StoredU256;
  private memeCount: StoredU256;

  constructor() {
    super();
    this.totalMemes = new StoredU256(TOTAL_MEMES_POINTER, EMPTY_POINTER);
    this.memeCount = new StoredU256(MEME_COUNT_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.totalMemes.set(u256.Zero);
    this.memeCount.set(u256.Zero);
  }

  @method('mintMeme')
  public mintMeme(_calldata: Calldata): BytesWriter {
    const memeId = this.totalMemes.value;
    this.totalMemes.set(SafeMath.add(memeId, u256.One));
    this.memeCount.set(SafeMath.add(this.memeCount.value, u256.One));

    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(memeId);
    return writer;
  }

  @method('getMemeCount')
  public getMemeCount(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.memeCount.value);
    return writer;
  }
}
