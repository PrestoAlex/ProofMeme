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

const TOTAL_MEMES_CREATED_POINTER = Blockchain.nextPointer;
const ACTIVE_MEMES_POINTER = Blockchain.nextPointer;
const TOTAL_VOLUME_POINTER = Blockchain.nextPointer;
const DAILY_STATS_POINTER = Blockchain.nextPointer;
const HOURLY_STATS_POINTER = Blockchain.nextPointer;

export class MemeCounterEnhanced extends OP_NET {
  private totalMemesCreated: StoredU256;
  private activeMemes: StoredU256;
  private totalVolume: StoredU256;
  private dailyStats: StoredU256;
  private hourlyStats: StoredU256;

  constructor() {
    super();
    this.totalMemesCreated = new StoredU256(TOTAL_MEMES_CREATED_POINTER, EMPTY_POINTER);
    this.activeMemes = new StoredU256(ACTIVE_MEMES_POINTER, EMPTY_POINTER);
    this.totalVolume = new StoredU256(TOTAL_VOLUME_POINTER, EMPTY_POINTER);
    this.dailyStats = new StoredU256(DAILY_STATS_POINTER, EMPTY_POINTER);
    this.hourlyStats = new StoredU256(HOURLY_STATS_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.totalMemesCreated.set(u256.Zero);
    this.activeMemes.set(u256.Zero);
    this.totalVolume.set(u256.Zero);
    this.dailyStats.set(u256.Zero);
    this.hourlyStats.set(u256.Zero);
  }

  @method('recordMemeCreation')
  public recordMemeCreation(calldata: Calldata): BytesWriter {
    const memeId = calldata.readU256();
    const timestamp = calldata.readU256();

    // Update total memes
    this.totalMemesCreated.set(SafeMath.add(this.totalMemesCreated.value, u256.One));
    
    // Update active memes
    this.activeMemes.set(SafeMath.add(this.activeMemes.value, u256.One));

    // Update daily stats (using timestamp as day identifier)
    const dayId = timestamp / u256.from(86400); // seconds in a day
    const dailyPointer = DAILY_STATS_POINTER + dayId;
    const dailyCount = new StoredU256(dailyPointer, EMPTY_POINTER);
    dailyCount.set(SafeMath.add(dailyCount.value, u256.One));

    // Update hourly stats
    const hourId = timestamp / u256.from(3600); // seconds in an hour
    const hourlyPointer = HOURLY_STATS_POINTER + hourId;
    const hourlyCount = new StoredU256(hourlyPointer, EMPTY_POINTER);
    hourlyCount.set(SafeMath.add(hourlyCount.value, u256.One));

    const writer = new BytesWriter(U256_BYTE_LENGTH * 4);
    writer.writeU256(this.totalMemesCreated.value);
    writer.writeU256(this.activeMemes.value);
    writer.writeU256(dailyCount.value);
    writer.writeU256(hourlyCount.value);
    return writer;
  }

  @method('recordVolume')
  public recordVolume(calldata: Calldata): BytesWriter {
    const amount = calldata.readU256();
    const timestamp = calldata.readU256();

    // Update total volume
    this.totalVolume.set(SafeMath.add(this.totalVolume.value, amount));

    // Update daily volume
    const dayId = timestamp / u256.from(86400);
    const dailyVolumePointer = DAILY_STATS_POINTER + dayId + u256.from(1000); // offset for volume
    const dailyVolume = new StoredU256(dailyVolumePointer, EMPTY_POINTER);
    dailyVolume.set(SafeMath.add(dailyVolume.value, amount));

    // Update hourly volume
    const hourId = timestamp / u256.from(3600);
    const hourlyVolumePointer = HOURLY_STATS_POINTER + hourId + u256.from(1000); // offset for volume
    const hourlyVolume = new StoredU256(hourlyVolumePointer, EMPTY_POINTER);
    hourlyVolume.set(SafeMath.add(hourlyVolume.value, amount));

    const writer = new BytesWriter(U256_BYTE_LENGTH * 3);
    writer.writeU256(this.totalVolume.value);
    writer.writeU256(dailyVolume.value);
    writer.writeU256(hourlyVolume.value);
    return writer;
  }

  @method('getTotalStats')
  public getTotalStats(_calldata: Calldata): BytesWriter {
    const writer = new BytesWriter(U256_BYTE_LENGTH * 3);
    writer.writeU256(this.totalMemesCreated.value);
    writer.writeU256(this.activeMemes.value);
    writer.writeU256(this.totalVolume.value);
    return writer;
  }

  @method('getDailyStats')
  public getDailyStats(calldata: Calldata): BytesWriter {
    const dayId = calldata.readU256();
    
    // Get daily meme count
    const dailyCountPointer = DAILY_STATS_POINTER + dayId;
    const dailyCount = new StoredU256(dailyCountPointer, EMPTY_POINTER);
    
    // Get daily volume
    const dailyVolumePointer = DAILY_STATS_POINTER + dayId + u256.from(1000);
    const dailyVolume = new StoredU256(dailyVolumePointer, EMPTY_POINTER);

    const writer = new BytesWriter(U256_BYTE_LENGTH * 2);
    writer.writeU256(dailyCount.value);
    writer.writeU256(dailyVolume.value);
    return writer;
  }

  @method('getHourlyStats')
  public getHourlyStats(calldata: Calldata): BytesWriter {
    const hourId = calldata.readU256();
    
    // Get hourly meme count
    const hourlyCountPointer = HOURLY_STATS_POINTER + hourId;
    const hourlyCount = new StoredU256(hourlyCountPointer, EMPTY_POINTER);
    
    // Get hourly volume
    const hourlyVolumePointer = HOURLY_STATS_POINTER + hourId + u256.from(1000);
    const hourlyVolume = new StoredU256(hourlyVolumePointer, EMPTY_POINTER);

    const writer = new BytesWriter(U256_BYTE_LENGTH * 2);
    writer.writeU256(hourlyCount.value);
    writer.writeU256(hourlyVolume.value);
    return writer;
  }

  @method('getWeeklyStats')
  public getWeeklyStats(calldata: Calldata): BytesWriter {
    const weekId = calldata.readU256();
    let weeklyMemes = u256.Zero;
    let weeklyVolume = u256.Zero;

    // Sum stats for 7 days
    for (let i = 0; i < 7; i++) {
      const dayId = weekId * u256.from(7) + u256.from(i);
      
      // Daily memes
      const dailyCountPointer = DAILY_STATS_POINTER + dayId;
      const dailyCount = new StoredU256(dailyCountPointer, EMPTY_POINTER);
      weeklyMemes = SafeMath.add(weeklyMemes, dailyCount.value);
      
      // Daily volume
      const dailyVolumePointer = DAILY_STATS_POINTER + dayId + u256.from(1000);
      const dailyVolume = new StoredU256(dailyVolumePointer, EMPTY_POINTER);
      weeklyVolume = SafeMath.add(weeklyVolume, dailyVolume.value);
    }

    const writer = new BytesWriter(U256_BYTE_LENGTH * 2);
    writer.writeU256(weeklyMemes);
    writer.writeU256(weeklyVolume);
    return writer;
  }

  @method('deactivateMeme')
  public deactivateMeme(calldata: Calldata): BytesWriter {
    const memeId = calldata.readU256();
    
    if (this.activeMemes.value > u256.Zero) {
      this.activeMemes.set(SafeMath.sub(this.activeMemes.value, u256.One));
    }

    const writer = new BytesWriter(U256_BYTE_LENGTH);
    writer.writeU256(this.activeMemes.value);
    return writer;
  }
}
