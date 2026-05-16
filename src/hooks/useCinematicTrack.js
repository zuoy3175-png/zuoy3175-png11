import { useCallback, useEffect, useRef, useState } from 'react';

const modeConfig = {
  calm: { pulseMs: 920, arpMs: 620, music: 0.45, bass: 0.42, pulse: 0.38, arp: 0.03 },
  build: { pulseMs: 620, arpMs: 360, music: 0.68, bass: 0.68, pulse: 0.64, arp: 0.055 },
  climax: { pulseMs: 460, arpMs: 260, music: 0.78, bass: 0.85, pulse: 0.9, arp: 0.07 },
  outro: { pulseMs: 1200, arpMs: 900, music: 0.34, bass: 0.34, pulse: 0.22, arp: 0.018 }
};

const arpPattern = [440, 660, 880, 660, 554, 740, 660, 440];

function makeNoiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate * 0.6, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function createGraph() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  const context = new AudioContext();
  const masterGain = context.createGain();
  const musicGain = context.createGain();
  const sfxGain = context.createGain();
  const bassGain = context.createGain();
  const pulseGain = context.createGain();
  const arpGain = context.createGain();
  const compressor = context.createDynamicsCompressor();
  const droneA = context.createOscillator();
  const droneB = context.createOscillator();
  const droneFilter = context.createBiquadFilter();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();

  masterGain.gain.value = 0.85;
  musicGain.gain.value = 0.75;
  sfxGain.gain.value = 0.95;
  bassGain.gain.value = 0.85;
  pulseGain.gain.value = 0.9;
  arpGain.gain.value = 0.055;

  compressor.threshold.value = -12;
  compressor.knee.value = 16;
  compressor.ratio.value = 10;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.18;

  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 130;
  droneFilter.Q.value = 2.6;
  droneA.type = 'sine';
  droneA.frequency.value = 42;
  droneB.type = 'triangle';
  droneB.frequency.value = 61;
  lfo.type = 'sine';
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 18;

  lfo.connect(lfoGain);
  lfoGain.connect(droneFilter.frequency);
  droneA.connect(droneFilter);
  droneB.connect(droneFilter);
  droneFilter.connect(bassGain);
  bassGain.connect(musicGain);
  pulseGain.connect(musicGain);
  arpGain.connect(musicGain);
  musicGain.connect(masterGain);
  sfxGain.connect(masterGain);
  masterGain.connect(compressor);
  compressor.connect(context.destination);

  droneA.start();
  droneB.start();
  lfo.start();

  return {
    context,
    masterGain,
    musicGain,
    sfxGain,
    bassGain,
    pulseGain,
    arpGain,
    noiseBuffer: makeNoiseBuffer(context),
    intervals: [],
    step: 0,
    mode: 'calm'
  };
}

export default function useCinematicTrack() {
  const graphRef = useRef(null);
  const onRef = useRef(false);
  const [musicOn, setMusicOn] = useState(false);
  const [volume, setVolume] = useState(70);

  const tone = useCallback((options = {}) => {
    const graph = graphRef.current;
    if (!graph || !onRef.current) return;
    const {
      frequency = 160,
      endFrequency = 80,
      duration = 0.12,
      gain = 0.2,
      type = 'sine',
      filterFrequency = 700,
      destination = graph.sfxGain
    } = options;
    const now = graph.context.currentTime;
    const osc = graph.context.createOscillator();
    const gainNode = graph.context.createGain();
    const filter = graph.context.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    filter.type = 'lowpass';
    filter.frequency.value = filterFrequency;
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(destination);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }, []);

  const noise = useCallback((gain = 0.15, duration = 0.2, frequency = 240) => {
    const graph = graphRef.current;
    if (!graph || !onRef.current) return;
    const now = graph.context.currentTime;
    const source = graph.context.createBufferSource();
    const gainNode = graph.context.createGain();
    const filter = graph.context.createBiquadFilter();
    source.buffer = graph.noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 1;
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.018);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(graph.sfxGain);
    source.start(now);
    source.stop(now + duration + 0.03);
  }, []);

  const clearClock = useCallback((graph) => {
    graph.intervals.forEach((id) => window.clearInterval(id));
    graph.intervals = [];
  }, []);

  const setMusicMode = useCallback((mode) => {
    const graph = graphRef.current;
    if (!graph || !onRef.current) return;
    const config = modeConfig[mode] || modeConfig.calm;
    const now = graph.context.currentTime;
    graph.mode = mode;
    clearClock(graph);

    graph.musicGain.gain.setTargetAtTime(config.music, now, 0.18);
    graph.bassGain.gain.setTargetAtTime(config.bass, now, 0.18);
    graph.pulseGain.gain.setTargetAtTime(config.pulse, now, 0.18);
    graph.arpGain.gain.setTargetAtTime(config.arp, now, 0.18);

    graph.intervals.push(window.setInterval(() => {
      tone({ frequency: 58, endFrequency: 32, duration: 0.22, gain: 0.28, type: 'triangle', filterFrequency: 140, destination: graph.bassGain });
      tone({ frequency: 180, endFrequency: 130, duration: 0.09, gain: 0.12, filterFrequency: 300, destination: graph.pulseGain });
    }, config.pulseMs));

    graph.intervals.push(window.setInterval(() => {
      const freq = arpPattern[graph.step % arpPattern.length];
      graph.step += 1;
      tone({ frequency: freq, endFrequency: freq * 0.992, duration: 0.075, gain: 0.08, filterFrequency: 1500, destination: graph.arpGain });
    }, config.arpMs));

    graph.intervals.push(window.setInterval(() => noise(0.018, 0.16, mode === 'climax' ? 520 : 360), mode === 'climax' ? 1100 : 1900));
  }, [clearClock, noise, tone]);

  const startAudio = useCallback(async () => {
    if (!graphRef.current) graphRef.current = createGraph();
    const graph = graphRef.current;
    if (!graph) return;
    if (graph.context.state === 'suspended') await graph.context.resume();
    onRef.current = true;
    setMusicOn(true);
    graph.masterGain.gain.setTargetAtTime((volume / 100) * 0.95, graph.context.currentTime, 0.04);
    setMusicMode('calm');
  }, [setMusicMode, volume]);

  const stopAudio = useCallback(() => {
    const graph = graphRef.current;
    onRef.current = false;
    setMusicOn(false);
    if (!graph) return;
    clearClock(graph);
    graph.masterGain.gain.setTargetAtTime(0.0001, graph.context.currentTime, 0.08);
  }, [clearClock]);

  const toggleMusic = useCallback(async () => {
    if (onRef.current) stopAudio();
    else await startAudio();
  }, [startAudio, stopAudio]);

  const setMasterVolume = useCallback((next) => {
    setVolume(next);
    const graph = graphRef.current;
    if (!graph) return;
    graph.masterGain.gain.setTargetAtTime((next / 100) * 0.95, graph.context.currentTime, 0.04);
  }, []);

  const playEnter = useCallback(() => { tone({ frequency: 92, endFrequency: 36, duration: 0.34, gain: 0.32, type: 'triangle', filterFrequency: 260 }); noise(0.08, 0.18, 180); }, [noise, tone]);
  const playChapterTransition = useCallback(() => { tone({ frequency: 74, endFrequency: 28, duration: 0.42, gain: 0.44, type: 'triangle', filterFrequency: 160 }); noise(0.18, 0.32, 150); }, [noise, tone]);
  const playPortalBuild = useCallback(() => { tone({ frequency: 168, endFrequency: 84, duration: 0.22, gain: 0.24, filterFrequency: 520 }); }, [tone]);
  const playWhiteFlash = useCallback(() => { tone({ frequency: 460, endFrequency: 80, duration: 0.3, gain: 0.34, filterFrequency: 1800 }); noise(0.22, 0.2, 760); }, [noise, tone]);
  const playNewWorldImpact = useCallback(() => { tone({ frequency: 62, endFrequency: 24, duration: 0.58, gain: 0.52, type: 'triangle', filterFrequency: 130 }); noise(0.2, 0.26, 240); }, [noise, tone]);
  const playWordHover = useCallback(() => { tone({ frequency: 260, endFrequency: 128, duration: 0.11, gain: 0.18, filterFrequency: 900 }); }, [tone]);
  const playWordActivate = useCallback(() => { tone({ frequency: 190, endFrequency: 72, duration: 0.22, gain: 0.28, filterFrequency: 620 }); }, [tone]);
  const playDeepPulse = useCallback((strength = 1) => { tone({ frequency: 58 + strength * 8, endFrequency: 24, duration: 0.44 + strength * 0.08, gain: 0.34 + strength * 0.14, type: 'triangle', filterFrequency: 130 }); noise(0.06 * strength, 0.16, 180); }, [noise, tone]);
  const playSoftClick = useCallback(() => { tone({ frequency: 160, endFrequency: 96, duration: 0.06, gain: 0.09, filterFrequency: 640 }); }, [tone]);

  useEffect(() => () => graphRef.current && clearClock(graphRef.current), [clearClock]);

  return {
    musicOn,
    volume,
    usingTrack: false,
    startAudio,
    stopAudio,
    toggleMusic,
    setMasterVolume,
    setMusicMode,
    playCue: setMusicMode,
    setCueParams: () => {},
    playEnter,
    playChapterTransition,
    playPortalBuild,
    playWhiteFlash,
    playNewWorldImpact,
    playWordHover,
    playWordActivate,
    playDeepPulse,
    playSoftClick
  };
}
