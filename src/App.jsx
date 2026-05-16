import { useCallback, useRef } from 'react';
import ActivatedWord from './components/ActivatedWord.jsx';
import ArchiveTable from './components/ArchiveTable.jsx';
import BigWordScene from './components/BigWordScene.jsx';
import BlackTransition from './components/BlackTransition.jsx';
import CinematicChapter from './components/CinematicChapter.jsx';
import CinematicSection from './components/CinematicSection.jsx';
import ImpactCut from './components/ImpactCut.jsx';
import MusicButton from './components/MusicButton.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import SuspendedFrameTransition from './components/SuspendedFrameTransition.jsx';
import WhitePortalScene from './components/WhitePortalScene.jsx';
import useCinematicTrack from './hooks/useCinematicTrack.js';
import useInView from './hooks/useInView.js';
import useParallax from './hooks/useParallax.js';
import useScrollDirection from './hooks/useScrollDirection.js';

const blackTransitions = new Set(['chapter-01', 'chapter-02', 'chapter-04', 'chapter-05']);
const impactKeys = new Set(['white-portal', 'suspended', 'verdict', 'return']);

function SectionLabel({ children }) {
  return <p className="sectionLabel">{children}</p>;
}

function Lines({ lines, className = '' }) {
  return (
    <p className={`copyLines ${className}`}>
      {lines.map((line, index) =>
        line ? <span key={`${line}-${index}`}>{line}</span> : <i key={index} aria-hidden="true" />
      )}
    </p>
  );
}

export default function App() {
  const {
    musicOn,
    volume,
    startAudio,
    toggleMusic,
    setMasterVolume,
    setMusicMode,
    playEnter,
    playChapterTransition,
    playPortalBuild,
    playWhiteFlash,
    playNewWorldImpact,
    playWordHover,
    playWordActivate,
    playDeepPulse,
    playSoftClick
  } = useCinematicTrack();
  const progress = useParallax();
  const progressHidden = useScrollDirection();
  const playedRef = useRef(new Set());

  const handleEnterSection = useCallback(
    (key) => {
      if (key === 'cover') setMusicMode('calm');
      if (key === 'hit' || key === 'excuse') setMusicMode('build');
      if (key === 'white-portal') {
        setMusicMode('build');
        playPortalBuild();
      }
      if (['suspended', 'verdict', 'position', 'table', 'feedback', 'feedback-table', 'less', 'final-work'].includes(key)) {
        setMusicMode('climax');
      }
      if (key === 'return' || key === 'credits') setMusicMode('outro');

      if (playedRef.current.has(key)) return;
      playedRef.current.add(key);
      if (blackTransitions.has(key)) playChapterTransition();
      else playSoftClick();
    },
    [playChapterTransition, playPortalBuild, playSoftClick, setMusicMode]
  );

  const active = useInView(handleEnterSection);

  const enterCalibration = async () => {
    await startAudio();
    playEnter();
    window.setTimeout(() => {
      document.getElementById('section-chapter-01')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const wordProps = {
    onActivate: playWordActivate,
    onHover: playWordHover
  };

  return (
    <main className={`cinemaPage nolanCut active-${active} ${musicOn ? 'has-music' : ''}`}>
      <ScrollProgress progress={progress} hidden={progressHidden} />
      <ImpactCut active={impactKeys.has(active)} />
      <div className="calibrationSpine" aria-hidden="true">
        <span />
      </div>

      <CinematicSection id="cover" className="coverScene" active={active === 'cover'}>
        <div className="coverFrame">
          <SectionLabel>Opening / COVER</SectionLabel>
          <h1 className="coverTitle">
            <span className="coverMinor">被</span>
            <ActivatedWord active={musicOn} className="coverMajor" {...wordProps}>
              作品校准
            </ActivatedWord>
            <span className="coverMinor coverEnd">的人</span>
          </h1>
          <p className="coverSubtitle">
            <span>你收藏了很多进化。</span>
            <span>但没有一次，是你自己的。</span>
          </p>
          <button className="enterCue" onClick={enterCalibration}>
            ENTER CALIBRATION →
          </button>
        </div>
      </CinematicSection>

      <BlackTransition id="chapter-01" chapter="CHAPTER 01" title="THE HIT / 刺痛" active={active === 'chapter-01'} />

      <CinematicChapter
        id="hit"
        active={active === 'hit'}
        chapter="01"
        label="THE HIT"
        title="不是大神吓到你"
        variant="dolly-hit"
        keyword="追尾"
        keywordClass="keyTail"
        aside
        lines={['真正刺你的，', '不是远方的大师。', '', '是和你站在同一个起点附近的人，', '已经把作品交出来了。']}
        {...wordProps}
      >
        <strong className="sting">你不是震撼。你是被进度撞了一下。</strong>
      </CinematicChapter>

      <BlackTransition id="chapter-02" chapter="CHAPTER 02" title="THE EXCUSE / 解释" active={active === 'chapter-02'} />

      <CinematicChapter
        id="excuse"
        active={active === 'excuse'}
        chapter="02"
        label="THE EXCUSE"
        title="你开始解释"
        variant="offset-excuse"
        keyword="解释"
        lines={[]}
        {...wordProps}
      >
        <div className="excuseLines">
          {['我只是中断了几天。', '我只是状态不好。', '我只是还没准备好。', '我只是还没找到方法。'].map((line, index) => (
            <span key={line} style={{ '--delay': `${index * 95}ms` }}>
              {line}
            </span>
          ))}
        </div>
        <p className="turnLine">
          <span>解释很温和。</span>
          <span>但它正在保护旧的你。</span>
        </p>
      </CinematicChapter>

      <WhitePortalScene
        active={active === 'white-portal'}
        onDeepPulse={playDeepPulse}
        onWhiteFlash={playWhiteFlash}
        onWordActivate={playWordActivate}
        onWordHover={playWordHover}
      />

      <SuspendedFrameTransition
        active={active === 'suspended'}
        onImpact={() => {
          setMusicMode('climax');
          playNewWorldImpact();
        }}
      />

      <BigWordScene
        id="verdict"
        active={active === 'verdict'}
        label="Chapter 03 / THE VERDICT"
        word="校准"
        note="校准不是鼓励。它把你放回具体的位置。"
        onActivate={playWordActivate}
        onHover={playWordHover}
      />

      <CinematicChapter
        id="position"
        active={active === 'position'}
        chapter="04"
        label="THE POSITION"
        title="作品让你失去借口"
        variant="push-position"
        keyword="借口"
        lines={['没做出来之前，', '你可以说自己只是状态不好。', '', '做出来之后，', '问题就变得具体了。']}
        {...wordProps}
      >
        <p className="threeCuts">
          <span>哪里弱。</span>
          <span>哪里乱。</span>
          <span>哪里没人想看。</span>
        </p>
      </CinematicChapter>

      <CinematicSection id="table" className="archiveScene cinematicChapter chapter-table" active={active === 'table'}>
        <div className="archiveWrap">
          <SectionLabel>Chapter 05 / THE TABLE</SectionLabel>
          <ArchiveTable
            title="两种人"
            leftTitle="想法型人"
            rightTitle="作品型人"
            leftItems={['收藏', '设想', '解释', '等待状态']}
            rightItems={['发布', '被看见', '被反馈', '继续修改']}
          />
          <p className="archiveFoot">差距不是认知。差距是有没有留下可被评价的东西。</p>
        </div>
      </CinematicSection>

      <CinematicChapter
        id="feedback"
        active={active === 'feedback'}
        chapter="06"
        label="THE FEEDBACK"
        title="反馈不是评价你"
        variant="push-feedback"
        keyword="定位"
        lines={['反馈只是在告诉你：', '你现在在哪里。', '', '不是羞辱。', '不是否定。', '只是定位。']}
        {...wordProps}
      />

      <CinematicSection id="feedback-table" className="archiveScene cinematicChapter chapter-table" active={active === 'feedback-table'}>
        <div className="archiveWrap">
          <SectionLabel>Calibration Log / SECOND TABLE</SectionLabel>
          <ArchiveTable
            title="两种反馈"
            leftTitle="解释型反馈"
            rightTitle="校准型反馈"
            leftItems={['我知道，但是', '我只是最近状态不好', '我的情况比较特殊', '等我准备好了']}
            rightItems={['哪一段最弱', '哪里没人想看', '下次改哪一个点', '三天后交新版']}
          />
        </div>
      </CinematicSection>

      <CinematicChapter
        id="less"
        active={active === 'less'}
        chapter="07"
        label="THE LESS"
        title="你需要的不是更多工具"
        variant="push-less"
        keyword="更少"
        lines={['更少解释。', '更少收藏。', '更少重启仪式。', '', '一个更快被交出去的版本。']}
        {...wordProps}
      />

      <CinematicChapter
        id="final-work"
        active={active === 'final-work'}
        chapter="08"
        label="THE WORK"
        title="交付之后，人才开始真实"
        variant="work-monument"
        keyword="交付"
        keywordClass="deliveryWord"
        lines={['没交付前，', '你可以是任何人。', '', '交付之后，', '你只能面对那个真实的版本。']}
        {...wordProps}
      >
        <strong className="sting">那才是进化的起点。</strong>
      </CinematicChapter>

      <BlackTransition id="chapter-05" chapter="CHAPTER 09" title="THE RETURN / 归队" active={active === 'chapter-05'} />

      <CinematicChapter
        id="return"
        active={active === 'return'}
        chapter="09"
        label="THE RETURN"
        title="不要再只看尾灯"
        variant="align-return"
        keyword="作品"
        keywordClass="finalWork"
        lines={['把这次刺痛，', '做成作品。']}
        {...wordProps}
      >
        <ActivatedWord active={active === 'return'} className="tailLightWord" {...wordProps}>
          尾灯
        </ActivatedWord>
      </CinematicChapter>

      <CinematicSection id="credits" className="creditsScene" active={active === 'credits'}>
        <div className="creditsRoll">
          {['IDEA', 'WORK', 'FEEDBACK', 'ITERATION'].map((word) => (
            <b key={word}>{word}</b>
          ))}
        </div>
        <small>END / CALIBRATED</small>
      </CinematicSection>

      <MusicButton musicOn={musicOn} volume={volume} onClick={toggleMusic} onVolumeChange={setMasterVolume} />
    </main>
  );
}
