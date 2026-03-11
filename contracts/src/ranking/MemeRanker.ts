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

const TOP_SCORE_POINTER = Blockchain.nextPointer;
const RANK_COUNT_POINTER = Blockchain.nextPointer;

export class MemeRanker extends OP_NET {
  private topScore: StoredU256;
  private rankCount: StoredU256;

  constructor() {
    super();
    this.topScore = new StoredU256(TOP_SCORE_POINTER, EMPTY_POINTER);
    this.rankCount = new StoredU256(RANK_COUNT_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.topScore.set(u256.Zero);
    this.rankCount.set(u256.Zero);
  }

  @method('updateRank')
  public updateRank(calldata: Calldata): BytesWriter {
    const score = calldata.readU256();
    
    if (u256.gt(score, this.topScore.value)) {
      this.topScore.set(score);
      this.rankCount.set(SafeMath.add(this.rankCount.value, u256.One));
    }

    const writer = new BytesWriter(1);
    writer.writeU8(1);
    return writer;
  }

  @method('getTopScore')
  public getTopScore(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.topScore.value);
    return writer;
  }
}
