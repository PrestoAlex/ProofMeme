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
const ROYALTY_FEE_POINTER = Blockchain.nextPointer;
const METADATA_POINTER = Blockchain.nextPointer;

export class MemeMinterEnhanced extends OP_NET {
  private totalMemes: StoredU256;
  private memeCount: StoredU256;
  private royaltyFee: StoredU256;
  private metadata: StoredU256;

  constructor() {
    super();
    this.totalMemes = new StoredU256(TOTAL_MEMES_POINTER, EMPTY_POINTER);
    this.memeCount = new StoredU256(MEME_COUNT_POINTER, EMPTY_POINTER);
    this.royaltyFee = new StoredU256(ROYALTY_FEE_POINTER, EMPTY_POINTER);
    this.metadata = new StoredU256(METADATA_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.totalMemes.set(u256.Zero);
    this.memeCount.set(u256.Zero);
    this.royaltyFee.set(u256.from(250)); // 2.5% royalty
  }

  @method('mintMeme')
  public mintMeme(calldata: Calldata): BytesWriter {
    const memeId = this.totalMemes.value;
    const metadataHash = calldata.readU256();
    const creator = calldata.readU256();
    const royaltyPercent = calldata.readU256();

    // Validate inputs
    if (royaltyPercent > u256.from(1000)) { // Max 10%
      throw new Revert('Royalty too high');
    }

    // Update counters
    this.totalMemes.set(SafeMath.add(memeId, u256.One));
    this.memeCount.set(SafeMath.add(this.memeCount.value, u256.One));

    // Store metadata
    this.metadata.set(metadataHash);

    const writer = new BytesWriter(U256_BYTE_LENGTH * 3);
    writer.writeU256(memeId);
    writer.writeU256(creator);
    writer.writeU256(royaltyPercent);
    return writer;
  }

  @method('getMemeCount')
  public getMemeCount(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.memeCount.value);
    return writer;
  }

  @method('getMemeInfo')
  public getMemeInfo(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH * 2);
    writer.writeU256(this.metadata.value);
    writer.writeU256(this.royaltyFee.value);
    return writer;
  }

  @method('setRoyaltyFee')
  public setRoyaltyFee(calldata: Calldata): BytesWriter {
    const newFee = calldata.readU256();
    
    if (newFee > u256.from(1000)) {
      throw new Revert('Royalty fee too high');
    }
    
    this.royaltyFee.set(newFee);
    
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(newFee);
    return writer;
  }
}
