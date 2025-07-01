import React, { useState } from 'react';
import './QuestionsAndAnswers.scss';

interface QAItem {
  id: number;
  question: string;
  asker: string;
  date: string;
  answer: string;
  answeredBy: string;
  answerDate: string;
}

const initialQAs: QAItem[] = [
  {
    id: 1,
    question: 'Does this bumper include mounting hardware?',
    asker: 'Ahmed Khan',
    date: 'June 15, 2025',
    answer: 'Yes, it comes with all necessary mounting brackets.',
    answeredBy: 'BodyTech Auto Parts',
    answerDate: 'June 16, 2025'
  },
  {
    id: 2,
    question: 'Is this compatible with Toyota Corolla 2019?',
    asker: 'Sara Malik',
    date: 'June 10, 2025',
    answer: 'It fits 2017 to 2019 models perfectly.',
    answeredBy: 'BodyTech Auto Parts',
    answerDate: 'June 11, 2025'
  }
];

const QuestionsAndAnswers = () => {
  const [qas, setQas] = useState(initialQAs);
  const [newQuestion, setNewQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newQA: QAItem = {
      id: qas.length + 1,
      question: newQuestion.trim(),
      asker: 'Anonymous',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      answer: '',
      answeredBy: '',
      answerDate: ''
    };

    setQas([newQA, ...qas]);
    setNewQuestion('');
  };

  return (
    <div className="qa-section">
      <h4>Ask A Question</h4>
      <form className="ask-question-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Ask a question about this product..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          rows={3}
        />
        <button type="submit">Submit Question</button>
      </form>

      <p className="reply-time-note">
        Usually replies within 24 hours.
      </p><br />

      {qas.length === 0 && <p>No questions have been asked yet.</p>}

      <div className="qa-list">
        {qas.map(({ id, question, asker, date, answer, answeredBy, answerDate }) => (
          <div key={id} className="qa-item">
            <div className="question">
              <strong>Q:</strong> {question}
              <div className="meta">Asked by {asker} on {date}</div>
            </div>
            {answer ? (
              <div className="answer">
                <strong>A:</strong> {answer}
                <div className="meta">Answered by {answeredBy} on {answerDate}</div>
              </div>
            ) : (
              <div className="answer pending">No answer yet.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsAndAnswers;
