import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Discovery } from '../data/discoveries';
import { SketchfabViewer } from './SketchfabViewer';
import { useGame } from '../state/GameContext';

interface DiscoveryCardProps {
  discovery: Discovery;
  onClose: () => void;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ discovery, onClose }) => {
  const { state, dispatch } = useGame();
  const [show3dModal, setShow3dModal] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [showVideo, setShowVideo] = useState(true);

  const isKids = state.audienceMode === 'kids';
  const photos = discovery.photos && discovery.photos.length > 0 ? discovery.photos : [];
  const currentPhoto = photos[activePhotoIdx] || photos[0];

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-40 block overflow-y-auto overscroll-contain p-4 bg-[#3D1206]/75 backdrop-blur-sm"
          style={{ WebkitOverflowScrolling: 'touch' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div className="min-h-full w-full flex items-center justify-center py-4">
            <motion.div
              className={`relative w-full ${
                isKids ? 'max-w-lg' : 'max-w-2xl'
              } bg-[#68230D] border-2 border-amber-300/55 rounded-3xl p-5 sm:p-6 shadow-2xl text-[#FFF8EB] flex flex-col gap-4`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top row with badge, Kids/Grown-Up toggle & close button */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider bg-amber-400 text-black shadow-sm flex items-center gap-1.5 animate-pulse">
                    <span>✨</span>
                    <span>DISCOVERY FOUND!</span>
                  </span>
                  <span
                    className={`hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      discovery.badge === 'Real NASA discovery'
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                        : 'bg-orange-500/20 text-orange-200 border border-orange-400/40'
                    }`}
                  >
                    {discovery.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quick Kids / Grown-Up switch inside Discovery Card */}
                  <div className="flex items-center bg-[#3E1306] p-0.5 rounded-xl border border-amber-300/35">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'SET_AUDIENCE_MODE', mode: 'kids' })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        isKids
                          ? 'bg-amber-400 text-[#2B0C04]'
                          : 'text-amber-100/75 hover:text-white'
                      }`}
                    >
                      🎈 Kids
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'SET_AUDIENCE_MODE', mode: 'grownup' })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        !isKids
                          ? 'bg-orange-500 text-white'
                          : 'text-amber-100/75 hover:text-white'
                      }`}
                    >
                      🔬 Grown-Up
                    </button>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-[#622110] hover:bg-[#852C16] text-[#F2D9A4] flex items-center justify-center font-bold text-base transition-colors focus-visible:outline-2 focus-visible:outline-[#EFE7D8] cursor-pointer"
                    aria-label="Close discovery"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-['Fraunces'] text-[#EFE7D8]">
                  {discovery.title}
                </h2>
              </div>

              {/* Actual NASA Discovery Photo Frame */}
              {currentPhoto && (
                <div className="w-full rounded-2xl border-2 border-amber-200/40 bg-[#2B0D05] overflow-hidden flex flex-col">
                  <div className="relative w-full h-48 sm:h-60 bg-[#1B0703] flex items-center justify-center overflow-hidden">
                    {!imgErrors[activePhotoIdx] ? (
                      <img
                        src={currentPhoto.url}
                        alt={currentPhoto.caption}
                        onError={() =>
                          setImgErrors((prev) => ({ ...prev, [activePhotoIdx]: true }))
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#451608] to-[#260B04]">
                        <span className="text-3xl mb-1">📸</span>
                        <p className="text-sm font-bold text-amber-200">{discovery.title}</p>
                        <p className="text-xs text-amber-100/80 mt-1 max-w-md">
                          {currentPhoto.caption}
                        </p>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-amber-300/40 text-[11px] font-bold text-amber-200">
                      📸 {currentPhoto.credit}
                    </span>
                  </div>

                  {/* Grown-Up Photo Caption & Multi-Photo Switcher */}
                  {!isKids && (
                    <div className="p-3 bg-[#3E1306] border-t border-amber-200/20 flex flex-col gap-2">
                      <p className="text-xs sm:text-sm text-amber-100 leading-snug">
                        {currentPhoto.caption}
                      </p>
                      {photos.length > 1 && (
                        <div className="flex items-center gap-2 pt-1">
                          {photos.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActivePhotoIdx(idx)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                activePhotoIdx === idx
                                  ? 'bg-amber-400 text-[#2B0C04]'
                                  : 'bg-[#571D0B] text-amber-200 hover:bg-[#6E250E]'
                              }`}
                            >
                              Photo {idx + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* KIDS VERSION: Simple 4-5 word sentences */}
              {isKids ? (
                <div className="bg-[#4D1909]/90 border border-amber-300/40 rounded-2xl p-4">
                  <p className="text-lg sm:text-xl font-bold text-[#FFF8EB] leading-relaxed font-['Plus_Jakarta_Sans']">
                    {discovery.kidsText}
                  </p>
                </div>
              ) : (
                /* GROWN-UP VERSION: Detailed scientific discovery, difficulties faced, and actual NASA video */
                <div className="flex flex-col gap-4">
                  {/* Scientific Context */}
                  <div className="bg-[#4D1909]/90 border border-amber-300/35 rounded-2xl p-4">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-1.5">
                      <span>🔬</span>
                      <span>Scientific Discovery Overview</span>
                    </div>
                    <p className="text-sm sm:text-base text-[#FFF8EB] leading-relaxed font-['Plus_Jakarta_Sans']">
                      {discovery.grownupText}
                    </p>
                  </div>

                  {/* Difficulties Faced While Discovering */}
                  {discovery.difficultiesFaced && discovery.difficultiesFaced.length > 0 && (
                    <div className="bg-[#3E1306]/95 border border-orange-400/45 rounded-2xl p-4">
                      <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-orange-300 mb-2 flex items-center gap-1.5">
                        <span>⚠️</span>
                        <span>Difficulties Faced During Discovery</span>
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm text-amber-100 leading-relaxed list-disc pl-4">
                        {discovery.difficultiesFaced.map((diff, i) => (
                          <li key={i}>{diff}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actual NASA Mission Video */}
                  {discovery.videoEmbedUrl && (
                    <div className="bg-[#381105] border border-amber-300/35 rounded-2xl p-3.5 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs sm:text-sm font-extrabold text-amber-200 flex items-center gap-1.5">
                          <span>🎬</span>
                          <span>{discovery.videoTitle}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowVideo((prev) => !prev)}
                          className="px-2.5 py-1 rounded-lg bg-[#591D0E] hover:bg-[#7A2A10] text-xs font-bold text-amber-200 cursor-pointer shrink-0"
                        >
                          {showVideo ? 'Hide Video' : 'Show Video'}
                        </button>
                      </div>

                      {showVideo && (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-amber-200/25">
                          <iframe
                            src={discovery.videoEmbedUrl}
                            title={discovery.videoTitle}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3D Model button if Sketchfab embed exists */}
              {discovery.sketchfab && (
                <button
                  onClick={() => setShow3dModal(true)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C44810] to-[#E05C1C] hover:brightness-110 text-white font-bold text-base shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🪐</span> Inspect 3D Model on Sketchfab
                </button>
              )}

              {/* Primary Dismiss & Continue Button */}
              <button
                onClick={onClose}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:brightness-110 text-white font-extrabold text-base shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
              >
                <span>✨</span>
                <span>{isKids ? 'Got It! Keep Driving!' : 'Got It! Saved to Field Journal'}</span>
                <span>📖</span>
              </button>

              {/* Source credit */}
              <div className="pt-2 border-t border-amber-200/25 flex items-center justify-between text-xs sm:text-sm text-amber-100">
                <span>Source: {discovery.source}</span>
                <span className="text-xs text-amber-200 font-mono">NASA JPL</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 3D viewer modal */}
      {show3dModal && discovery.sketchfab && (
        <SketchfabViewer
          config={discovery.sketchfab}
          onClose={() => setShow3dModal(false)}
        />
      )}
    </>
  );
};
