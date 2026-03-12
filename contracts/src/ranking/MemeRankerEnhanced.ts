import { u256 } from '@btc-vision/as-bignum/assembly';
import {
  Blockchain,
  BytesWriter,
  Calldata,
  EMPTY_POINTER,
  OP_NET,
  Revert,
  StoredU256,
  StoredBytes,
  U256_BYTE_LENGTH,
  SafeMath,
} from '@btc-vision/btc-runtime/runtime';

const RANKING_COUNT_POINTER = Blockchain.nextPointer;
const VOTE_COUNT_POINTER = Blockchain.nextPointer;
const MEME_SCORES_POINTER = Blockchain.nextPointer;
const TOP_MEMES_POINTER = Blockchain.nextPointer;

export class MemeRankerEnhanced extends OP_NET {
  private rankingCount: StoredU256;
  private voteCount: StoredU256;
  private memeScores: StoredU256;
  private topMemes: StoredBytes;

  constructor() {
    super();
    this.rankingCount = new StoredU256(RANKING_COUNT_POINTER, EMPTY_POINTER);
    this.voteCount = new StoredU256(VOTE_COUNT_POINTER, EMPTY_POINTER);
    this.memeScores = new StoredU256(MEME_SCORES_POINTER, EMPTY_POINTER);
    this.topMemes = new StoredBytes(TOP_MEMES_POINTER, EMPTY_POINTER, 320); // Top 10 memes
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.rankingCount.set(u256.Zero);
    this.voteCount.set(u256.Zero);
    this.memeScores.set(u256.Zero);
  }

  @method('voteMeme')
  public voteMeme(calldata: Calldata): BytesWriter {
    const memeId = calldata.readU256();
    const voter = calldata.readBytes(32);
    const voteType = calldata.readU256(); // 1 = upvote, 0 = downvote

    // Validate vote type
    if (voteType > u256.One) {
      Revert('Invalid vote type');
    }

    // Update vote count
    this.voteCount.set(SafeMath.add(this.voteCount.value, u256.One));

    // Update meme score
    const memeScorePointer = MEME_SCORES_POINTER + memeId;
    const currentScore = new StoredU256(memeScorePointer, EMPTY_POINTER);
    
    if (voteType == u256.One) {
      currentScore.set(SafeMath.add(currentScore.value, u256.One));
    } else {
      if (currentScore.value > u256.Zero) {
        currentScore.set(SafeMath.sub(currentScore.value, u256.One));
      }
    }

    // Update top memes ranking
    this.updateRanking(memeId, currentScore.value);

    const writer = new BytesWriter(U256_BYTE_LENGTH * 2);
    writer.writeU256(memeId);
    writer.writeU256(currentScore.value);
    return writer;
  }

  @method('getMemeScore')
  public getMemeScore(calldata: Calldata): BytesWriter {
    const memeId = calldata.readU256();
    const memeScorePointer = MEME_SCORES_POINTER + memeId;
    const memeScore = new StoredU256(memeScorePointer, EMPTY_POINTER);
    
    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(memeScore.value);
    return writer;
  }

  @method('getTopMemes')
  public getTopMemes(calldata: Calldata): BytesWriter {
    const count = calldata.readU256(); // Number of top memes to return (max 10)
    
    if (count > u256.from(10)) {
      Revert('Too many memes requested');
    }

    const writer = new BytesWriter(320); // 10 memes * 32 bytes each
    writer.writeBytes(this.topMemes.value);
    return writer;
  }

  @method('getRankingStats')
  public getRankingStats(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH * 2);
    writer.writeU256(this.voteCount.value);
    writer.writeU256(this.rankingCount.value);
    return writer;
  }

  @method('updateMemeRanking')
  public updateMemeRanking(calldata: Calldata): BytesWriter {
    const memeId = calldata.readU256();
    const newScore = calldata.readU256();

    const memeScorePointer = MEME_SCORES_POINTER + memeId;
    const currentScore = new StoredU256(memeScorePointer, EMPTY_POINTER);
    currentScore.set(newScore);

    this.updateRanking(memeId, newScore);

    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(newScore);
    return writer;
  }

  private updateRanking(memeId: u256, score: u256): void {
    // Simple ranking update - in production, use more sophisticated algorithm
    const currentTop = this.topMemes.value;
    
    // Find position in top 10
    for (let i = 0; i < 10; i++) {
      const offset = i * 32;
      const currentMemeId = this.bytesToU256(currentTop.slice(offset, offset + 32));
      
      if (currentMemeId == u256.Zero || score > this.getMemeScoreById(currentMemeId)) {
        // Insert at position i
        this.insertMemeAtPosition(memeId, i);
        break;
      }
    }
  }

  private getMemeScoreById(memeId: u256): u256 {
    const memeScorePointer = MEME_SCORES_POINTER + memeId;
    const memeScore = new StoredU256(memeScorePointer, EMPTY_POINTER);
    return memeScore.value;
  }

  private insertMemeAtPosition(memeId: u256, position: i32): void {
    // Shift existing memes down
    const currentTop = this.topMemes.value;
    const newTop = new Uint8Array(320);
    
    // Copy memes before position
    for (let i = 0; i < position; i++) {
      const offset = i * 32;
      for (let j = 0; j < 32; j++) {
        newTop[offset + j] = currentTop[offset + j];
      }
    }
    
    // Insert new meme
    const memeBytes = this.u256ToBytes(memeId);
    for (let i = 0; i < 32; i++) {
      newTop[position * 32 + i] = memeBytes[i];
    }
    
    // Copy remaining memes (shifted)
    for (let i = position; i < 9; i++) {
      const offset = i * 32;
      for (let j = 0; j < 32; j++) {
        newTop[(i + 1) * 32 + j] = currentTop[offset + j];
      }
    }
    
    this.topMemes.set(newTop);
  }

  private bytesToU256(bytes: Uint8Array): u256 {
    let result = u256.Zero;
    for (let i = 0; i < bytes.length; i++) {
      result = SafeMath.add(SafeMath.mul(result, u256.from(256)), u256.from(bytes[i]));
    }
    return result;
  }

  private u256ToBytes(value: u256): Uint8Array {
    const bytes = new Uint8Array(32);
    let temp = value;
    for (let i = 31; i >= 0; i--) {
      bytes[i] = changetype<u8>(temp & u256.from(255));
      temp = temp >> 8;
    }
    return bytes;
  }
}
