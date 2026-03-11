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

const MEME_VIEWS_POINTER = Blockchain.nextPointer;
const MEME_SHARES_POINTER = Blockchain.nextPointer;

export class MemeCounter extends OP_NET {
  private memeViews: StoredU256;
  private memeShares: StoredU256;

  constructor() {
    super();
    this.memeViews = new StoredU256(MEME_VIEWS_POINTER, EMPTY_POINTER);
    this.memeShares = new StoredU256(MEME_SHARES_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.memeViews.set(u256.Zero);
    this.memeShares.set(u256.Zero);
  }

  @method('viewMeme')
  public viewMeme(_calldata: Calldata): BytesWriter {
    this.memeViews.set(SafeMath.add(this.memeViews.value, u256.One));

    const writer = new BytesWriter(1);
    writer.writeU8(1);
    return writer;
  }

  @method('shareMeme')
  public shareMeme(_calldata: Calldata): BytesWriter {
    this.memeShares.set(SafeMath.add(this.memeShares.value, u256.One));

    const writer = new BytesWriter(1);
    writer.writeU8(1);
    return writer;
  }

  @method('getMemeViews')
  public getMemeViews(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.memeViews.value);
    return writer;
  }

  @method('getMemeShares')
  public getMemeShares(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.memeShares.value);
    return writer;
  }
}
