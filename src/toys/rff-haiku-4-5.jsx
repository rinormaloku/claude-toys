import React, { useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';

export default function RRFVisualizer() {
  const [showCalculation, setShowCalculation] = useState(false);

  // Sample data: 3 ranked lists
  const lists = [
    {
      id: 'search1',
      name: 'Search Engine A',
      color: '#FF6B6B',
      items: [
        { rank: 1, title: 'Wikipedia - ML' },
        { rank: 2, title: 'Stanford Course' },
        { rank: 3, title: 'Research Paper' },
        { rank: 4, title: 'Tutorial Blog' },
        { rank: 5, title: 'Video Series' }
      ]
    },
    {
      id: 'search2',
      name: 'Search Engine B',
      color: '#4ECDC4',
      items: [
        { rank: 1, title: 'Video Series' },
        { rank: 2, title: 'Research Paper' },
        { rank: 3, title: 'Tutorial Blog' },
        { rank: 4, title: 'GitHub Repo' },
        { rank: 5, title: 'Stanford Course' }
      ]
    },
    {
      id: 'search3',
      name: 'Search Engine C',
      color: '#95E1D3',
      items: [
        { rank: 1, title: 'Tutorial Blog' },
        { rank: 2, title: 'Stanford Course' },
        { rank: 3, title: 'Wikipedia - ML' },
        { rank: 4, title: 'Video Series' },
        { rank: 5, title: 'Documentation' }
      ]
    }
  ];

  // Calculate RRF scores
  const rrfResults = useMemo(() => {
    const k = 60; // RRF parameter (commonly 60)
    const scores = {};
    const details = {};

    // Initialize
    lists.forEach(list => {
      list.items.forEach(item => {
        if (!scores[item.title]) {
          scores[item.title] = 0;
          details[item.title] = [];
        }
      });
    });

    // Calculate RRF for each item
    lists.forEach((list, listIdx) => {
      list.items.forEach(item => {
        const score = 1 / (k + item.rank);
        scores[item.title] += score;
        details[item.title].push({
          list: list.name,
          rank: item.rank,
          score: score.toFixed(6),
          color: list.color
        });
      });
    });

    // Sort by score
    const sorted = Object.entries(scores)
      .map(([title, score]) => ({
        title,
        score: parseFloat(score.toFixed(6)),
        details: details[title]
      }))
      .sort((a, b) => b.score - a.score);

    return sorted;
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Reciprocal Rank Fusion
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl leading-relaxed">
            Watch how multiple ranked lists are combined using RRF to create a unified ranking. Each item receives a score based on its position in every list.
          </p>
        </div>

        {/* Input Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-2xl p-6 shadow-xl overflow-hidden"
            >
              <div
                className="h-1.5 rounded-full mb-4"
                style={{ background: list.color }}
              />
              <h2 className="text-xl font-bold text-gray-900 mb-6">{list.name}</h2>
              <div className="space-y-3">
                {list.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-lg"
                    style={{ background: `${list.color}15` }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: list.color }}
                    >
                      {item.rank}
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Merge Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setShowCalculation(!showCalculation)}
            className="px-8 py-3 bg-white text-purple-700 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 hover:scale-105"
          >
            {showCalculation ? 'Hide' : 'Fuse Lists'}
            <ChevronRight size={20} />
          </button>
        </div>

        {/* RRF Formula and Explanation */}
        {showCalculation && (
          <div className="mb-12 bg-white rounded-2xl p-8 shadow-xl animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>

            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
              <p className="text-gray-800 font-semibold mb-3">RRF Formula:</p>
              <div className="font-mono text-lg text-purple-700 bg-white p-4 rounded border border-purple-200">
                Score = Σ 1 / (k + rank) for each list
              </div>
              <p className="text-gray-700 mt-3 text-sm">
                Where <span className="font-mono bg-purple-100 px-2 py-1 rounded">k</span> = 60 (standard parameter). Items not in a list contribute 0 to that list's sum.
              </p>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              Each item is scored based on its rank across all three search engines. A rank of 1 contributes <span className="font-mono bg-gray-200 px-2 py-1 rounded">1/61 ≈ 0.016393</span>, while a rank of 5 contributes <span className="font-mono bg-gray-200 px-2 py-1 rounded">1/65 ≈ 0.015385</span>. Items that appear in multiple lists accumulate higher scores.
            </p>
          </div>
        )}

        {/* Results */}
        {showCalculation && (
          <div className="bg-white rounded-2xl p-8 shadow-xl animate-in fade-in duration-700">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Fused Results (Sorted by RRF Score)</h3>

            <div className="space-y-4">
              {rrfResults.map((result, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-colors"
                  style={{
                    animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`
                  }}
                >
                  {/* Main Result Row */}
                  <div className="p-5 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">
                          {result.title}
                        </h4>
                        <p className="text-sm text-purple-600 font-semibold">
                          RRF Score: {result.score.toFixed(6)}
                        </p>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="flex-shrink-0 w-32 ml-4">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                          style={{
                            width: `${(result.score / Math.max(...rrfResults.map(r => r.score))) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-5 pb-4 pt-2 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {result.details.map((detail, dIdx) => (
                        <div
                          key={dIdx}
                          className="p-3 rounded text-sm"
                          style={{ background: `${detail.color}20` }}
                        >
                          <div className="font-semibold text-gray-800 mb-1">
                            {detail.list}
                          </div>
                          <div className="text-gray-700">
                            Rank <span className="font-bold">{detail.rank}</span>
                            <span className="text-gray-500 ml-2">
                              = 1/{60 + detail.rank} = {detail.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-10 p-6 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-gray-800 text-sm leading-relaxed">
                <span className="font-bold text-purple-700">Key insight:</span> Items appearing in multiple lists rank higher because their scores accumulate. For example, "Stanford Course" appears in all three lists, giving it multiple contributions to its final score.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}