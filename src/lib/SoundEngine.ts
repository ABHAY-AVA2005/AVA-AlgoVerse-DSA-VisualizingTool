class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, vol: number = 0.1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playValue(value: number, minVal: number = 0, maxVal: number = 100) {
    const minFreq = 200;
    const maxFreq = 1200;
    const percent = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal || 1)));
    const freq = minFreq + percent * (maxFreq - minFreq);
    this.playTone(freq, 'sine', 0.1, 0.05);
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const now = ctx.currentTime;
    
    const freqs = [440, 554.37, 659.25, 880]; // A Major Chord
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.5);
    });
  }
}

export const soundEngine = new SoundEngine();
