import React, { useState } from 'react';
import { Copy, Check, Play, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onUrlSave?: (url: string) => void;
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    // Handle youtu.be short links
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    // Handle standard youtube.com/watch?v=
    const standardMatch = url.match(/[?&]v=([^&]+)/);
    if (standardMatch) return `https://www.youtube.com/embed/${standardMatch[1]}`;
    // Handle already-embed URLs
    if (url.includes('/embed/')) return url;
  } catch {}
  return null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onUrlSave }) => {
  const [inputUrl, setInputUrl] = useState(videoUrl || '');
  const [activeUrl, setActiveUrl] = useState(videoUrl || '');
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(!videoUrl);

  const embedUrl = getEmbedUrl(activeUrl);

  const handleCopy = async () => {
    if (!activeUrl) return;
    await navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setActiveUrl(inputUrl);
    setEditMode(false);
    onUrlSave?.(inputUrl);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Video Embed */}
      {embedUrl ? (
        <div className="relative w-full rounded-3xl overflow-hidden shadow-soft border-2 border-purple-100 bg-black">
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
            <Play className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-center">
            <p className="font-black text-purple-900">No video linked yet</p>
            <p className="text-purple-500 font-medium text-sm mt-1">Paste a YouTube link below to connect a video for this chapter!</p>
          </div>
        </div>
      )}

      {/* URL Bar */}
      <div className="card-purple p-4 flex flex-col gap-3">
        <p className="text-xs font-black text-purple-500 uppercase tracking-wider flex items-center gap-2">
          <Play className="w-4 h-4 text-red-500" />
          YouTube Video Link
        </p>

        {editMode ? (
          <div className="flex gap-2">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 bg-purple-50 border-2 border-purple-200 rounded-2xl px-4 py-2.5 text-purple-900 font-medium text-sm focus:outline-none focus:border-purple-400 transition-colors"
            />
            <button
              onClick={handleSave}
              className="btn-primary text-sm px-5 py-2.5"
            >
              Link Video ✅
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-purple-50 border-2 border-purple-100 rounded-2xl px-4 py-2.5 text-purple-700 font-medium text-sm truncate">
              {activeUrl || 'No link added yet'}
            </div>
            {activeUrl && (
              <>
                <button
                  onClick={handleCopy}
                  title="Copy link"
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm border-2 transition-all duration-300 ${
                    copied
                      ? 'border-green-400 bg-green-50 text-green-700'
                      : 'border-purple-200 bg-white text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in YouTube"
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm border-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            )}
            <button
              onClick={() => setEditMode(true)}
              className="flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-sm border-2 border-purple-100 bg-white text-purple-500 hover:bg-purple-50 transition-colors"
            >
              {activeUrl ? 'Change' : '+ Add Link'}
            </button>
          </div>
        )}
      </div>

      {/* Pip's Hint */}
      <div className="bg-purple-50 border-2 border-purple-100 rounded-2xl p-4 flex gap-3 items-start">
        <span className="text-3xl animate-bounce-subtle">🐶</span>
        <p className="text-sm text-purple-700 font-medium leading-relaxed">
          <span className="font-black">Pip says:</span> Ask a parent or teacher to link a YouTube video for this chapter. Then you can watch and learn before taking the quiz! 🎬
        </p>
      </div>
    </div>
  );
};
