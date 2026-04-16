-- Migration 003: Seed Data
-- Insert sample tracks, courses, and 1 lesson for testing

INSERT INTO tracks (slug, title, title_ja, description, icon, order_index, is_published) VALUES
  ('it-passport', 'IT Passport', 'ITパスポート', 'Luyện thi chứng chỉ IT Passport Nhật Bản', '📋', 1, true),
  ('brse-skills', 'BrSE Skills', 'ブリッジSEスキル', 'Kỹ năng Bridge SE thực chiến', '🌉', 2, true),
  ('sap-japan', 'SAP Japan', 'SAP日本語', 'SAP tại thị trường Nhật Bản', '🔷', 3, true),
  ('business-jp', 'Business Japanese IT', 'ビジネス日本語IT', 'Tiếng Nhật thương mại cho IT', '🎌', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Seed courses for BrSE track
INSERT INTO courses (track_id, slug, title, title_ja, description, level, order_index, is_published)
SELECT
  t.id,
  'brse-work-culture',
  'Japanese Work Culture',
  '日本の職場文化',
  'Văn hóa làm việc tại Nhật — ほうれんそう, Kaizen, On-time culture',
  'beginner',
  1,
  true
FROM tracks t WHERE t.slug = 'brse-skills'
ON CONFLICT (slug) DO NOTHING;

-- Seed lesson with full content example
INSERT INTO lessons (course_id, title, title_ja, content, summary, is_free, order_index, estimated_minutes, is_published)
SELECT
  c.id,
  'ほうれんそう (報連相) — Nguyên tắc giao tiếp tại Nhật',
  'ほうれんそう入門',
  '{
    "version": "1.0",
    "blocks": [
      {
        "id": "blk_001",
        "type": "theory",
        "order": 1,
        "data": {
          "html": "<h3>ほうれんそう (報連相) là gì?</h3><p>ほうれんそう là viết tắt của <strong>報告 (Báo cáo)</strong>, <strong>連絡 (Liên lạc)</strong>, và <strong>相談 (Thảo luận)</strong> — 3 nguyên tắc giao tiếp cốt lõi trong môi trường làm việc Nhật Bản.</p><p>Đây không chỉ là quy tắc, mà là <em>văn hóa</em>. Người Nhật đánh giá rất cao nhân viên biết thực hành ほうれんそう đúng cách.</p><h4>3 thành phần</h4><ul><li><strong>報告 (ほうこく)</strong>: Báo cáo kết quả công việc cho cấp trên</li><li><strong>連絡 (れんらく)</strong>: Liên lạc thông tin cần thiết cho team</li><li><strong>相談 (そうだん)</strong>: Thảo luận khi gặp vấn đề hoặc cần quyết định</li></ul>",
          "vocab_highlights": [
            { "term": "報告", "reading": "ほうこく", "meaning_vi": "Báo cáo (kết quả cho cấp trên)" },
            { "term": "連絡", "reading": "れんらく", "meaning_vi": "Liên lạc (thông báo thông tin)" },
            { "term": "相談", "reading": "そうだん", "meaning_vi": "Thảo luận (hỏi ý kiến người khác)" }
          ]
        }
      },
      {
        "id": "blk_002",
        "type": "real_case",
        "order": 2,
        "data": {
          "scenario_title": "Sprint Review bị delay tại dự án JSOL",
          "context": "Dự án ERP migration cho khách hàng JSOL. Khách hàng yêu cầu daily status report. Sprint review được lên lịch lúc 9AM hôm sau.",
          "situation": "4PM, developer Dang phát hiện bug critical làm crash toàn bộ module kế toán. Fix ít nhất 3 tiếng. Demo 9AM hôm sau có nguy cơ fail.",
          "what_happened": "Dang không báo cáo ngay, tự mình cố fix đến 11PM. Hôm sau demo fail, PM Nhật phát hiện bug được biết từ chiều hôm trước. PM mất trust, yêu cầu daily written report từ đó.",
          "takeaway": "報告は早め (Báo cáo sớm) — Dù tin xấu, báo cáo ngay giúp team có thể cùng giải quyết. Tự giải quyết quá lâu không phải điểm mạnh trong văn hóa Nhật."
        }
      },
      {
        "id": "blk_003",
        "type": "dialogue",
        "order": 3,
        "data": {
          "scene": "Morning standup — Dang báo cáo bug status cho PM Nhật",
          "lines": [
            {
              "speaker": "jp",
              "speaker_label": "田中PM",
              "text_ja": "おはようございます。昨日のバグ対応、その後どうですか？",
              "text_vi": "Chào buổi sáng. Việc xử lý bug hôm qua, sau đó thế nào rồi?",
              "note": null
            },
            {
              "speaker": "brse",
              "speaker_label": "Dang (BrSE)",
              "text_ja": "ご報告します。昨日16時に原因を特定しました。修正は完了しており、現在テスト中です。結果は本日17時にご連絡します。",
              "text_vi": "Tôi xin báo cáo. Hôm qua lúc 16h đã xác định được nguyên nhân. Việc sửa đã hoàn thành, hiện đang test. Kết quả sẽ liên lạc vào 17h hôm nay.",
              "note": "ご報告します — keigo form của 報告します, lịch sự hơn và phù hợp khi nói với PM"
            },
            {
              "speaker": "jp",
              "speaker_label": "田中PM",
              "text_ja": "わかりました。何か困ったことがあれば、すぐ相談してください。",
              "text_vi": "Hiểu rồi. Nếu có gì khó khăn, hãy thảo luận ngay nhé.",
              "note": null
            }
          ]
        }
      },
      {
        "id": "blk_004",
        "type": "vocab_spotlight",
        "order": 4,
        "data": {
          "items": [
            {
              "term": "エスカレーション",
              "reading": "escalation",
              "meaning_vi": "Leo thang vấn đề lên cấp trên",
              "meaning_en": "Escalation",
              "example_ja": "この問題はエスカレーションが必要です。",
              "example_vi": "Vấn đề này cần phải leo thang lên cấp trên.",
              "category": "BrSE"
            },
            {
              "term": "報告は早め",
              "reading": "ほうこくははやめ",
              "meaning_vi": "Báo cáo sớm (dù tin tốt hay xấu)",
              "example_ja": "報告は早めにすることが大切です。",
              "example_vi": "Việc báo cáo sớm là rất quan trọng.",
              "category": "BrSE"
            },
            {
              "term": "ほうれんそう",
              "reading": "報告・連絡・相談",
              "meaning_vi": "Báo cáo - Liên lạc - Thảo luận",
              "example_ja": "ほうれんそうを徹底してください。",
              "example_vi": "Hãy thực hiện triệt để ほうれんそう.",
              "category": "BrSE"
            }
          ]
        }
      },
      {
        "id": "blk_005",
        "type": "quick_check",
        "order": 5,
        "data": {
          "questions": [
            {
              "text": "Khi gặp vấn đề kỹ thuật không tự giải quyết được sau 2 tiếng, bạn nên dùng phần nào của ほうれんそう?",
              "options": [
                { "id": "a", "text": "報告 — Báo cáo kết quả cuối ngày như bình thường", "is_correct": false },
                { "id": "b", "text": "連絡 — Gửi email cho team biết đang có vấn đề", "is_correct": false },
                { "id": "c", "text": "相談 — Thảo luận với người có kinh nghiệm hơn ngay lập tức", "is_correct": true },
                { "id": "d", "text": "Không cần làm gì, tự giải quyết tiếp", "is_correct": false }
              ],
              "explanation": "相談 là đúng — Khi gặp vấn đề vượt khả năng và mất nhiều thời gian, việc 相談 (thảo luận) với senior hoặc PM ngay là cách làm đúng trong văn hóa Nhật. Đừng để quá lâu vì có thể ảnh hưởng đến cả team."
            }
          ]
        }
      },
      {
        "id": "blk_006",
        "type": "summary",
        "order": 6,
        "data": {
          "key_points": [
            "ほうれんそう = 報告・連絡・相談 — 3 nguyên tắc giao tiếp không thể thiếu tại công ty Nhật",
            "Luôn báo cáo sớm (報告は早め), dù là tin xấu — PM Nhật đánh giá rất cao điều này",
            "Khi gặp vấn đề khó, hãy 相談 ngay — không tự giải quyết quá 2 tiếng"
          ],
          "vocab_recap": ["報告", "連絡", "相談", "エスカレーション", "報告は早め"],
          "next_lesson_teaser": "Tiếp theo: エスカレーション — Khi nào cần leo thang và nói gì với PM?"
        }
      }
    ]
  }'::jsonb,
  'Học ほうれんそう — nguyên tắc báo cáo, liên lạc, thảo luận trong môi trường làm việc Nhật Bản.',
  true,
  1,
  15,
  true
FROM courses c WHERE c.slug = 'brse-work-culture'
ON CONFLICT DO NOTHING;
