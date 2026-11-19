import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { answerChallenge, getChallenge } from '../api';
import CountdownRing from '../components/CountdownRing.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import { useCountdown } from '../hooks/useCountdown.js';
import { usePlayer } from '../hooks/usePlayer.js';
import { TIMEOUT_GRACE_MS } from '../utils/constants.js';
import '../styles/screens.css';
import '../styles/game.css';

/**
 * Οθόνη 4: Challenge (mockup M-12). Task #15.
 * Endpoints: GET /games/{gameId}/challenges/{challengeId}?playerId=..., POST /games/{gameId}/players/{playerId}/challenge-answer.
 * Μετά την απάντηση ο παίκτης επιστρέφει στο game board, που δείχνει το αποτέλεσμα (M-9, M-10, M-11).
 */
export default function ChallengePage() {
  const params = useParams();
  const gameId = Number(params.gameId);
  const challengeId = Number(params.challengeId);
  const { playerId } = usePlayer();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [chosen, setChosen] = useState(null);
  const submitted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    getChallenge(gameId, challengeId, playerId)
      .then(({ data }) => !cancelled && setChallenge(data))
      .catch((err) => !cancelled && setError(err));
    return () => {
      cancelled = true;
    };
  }, [gameId, challengeId, playerId]);

  const secondsLeft = useCountdown(challenge?.timeLimit ?? 0, challenge ? challenge.challengeId : null);
  const timedOut = challenge !== null && secondsLeft <= 0;

  /** Στέλνει την απάντηση (μία φορά) και επιστρέφει στο board με το αποτέλεσμα. */
  const submit = useCallback(
    async (answer, outOfTime) => {
      if (submitted.current) return;
      submitted.current = true;
      setSubmitting(true);
      try {
        const { data, message } = await answerChallenge(gameId, playerId, challengeId, answer);
        const expired = outOfTime || /timed out/i.test(message);
        const outcome = expired ? 'timeout' : data.cellAcquired ? 'success' : 'failed';
        navigate(`/game/${gameId}`, { replace: true, state: { challengeResult: { outcome, cell: data.cell, message } } });
      } catch (err) {
        setError(err);
        setSubmitting(false);
      }
    },
    [gameId, playerId, challengeId, navigate],
  );

  // Όταν τελειώσει ο χρόνος, το backend σημειώνει το challenge ως ληγμένο (tick ανά δευτερόλεπτο).
  // Περιμένουμε λίγο και στέλνουμε κενή απάντηση για να πάρουμε το αποτέλεσμα (M-11).
  useEffect(() => {
    if (!timedOut || submitted.current) return undefined;
    const id = setTimeout(() => submit('', true), TIMEOUT_GRACE_MS);
    return () => clearTimeout(id);
  }, [timedOut, submit]);

  function choose(option) {
    setChosen(option);
    submit(option, false);
  }

  if (!challenge && !error) return <Loader text="Loading your challenge…" />;

  return (
    <div className="screen screen-game screen-challenge">
      {error && (
        <div className="card notice">
          <ErrorMessage error={error} />
          <Link to={`/game/${gameId}`}>Back to the game board</Link>
        </div>
      )}

      {challenge && (
        <section className="challenge-card" aria-labelledby="challenge-question">
          <p className="challenge-intro">
            You entered the exam room, still facing the consequences of last night&apos;s decisions.
            You manage to read the question:
          </p>

          <div className="challenge-body">
            <div className="challenge-timer">
              <CountdownRing seconds={secondsLeft} total={challenge.timeLimit} size={84} />
            </div>
            <h1 id="challenge-question" className="challenge-question">{challenge.question}</h1>
          </div>

          <div className="challenge-options" role="group" aria-label="Answers">
            {challenge.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`btn challenge-option ${chosen === option ? 'is-chosen' : ''}`}
                onClick={() => choose(option)}
                disabled={submitting || timedOut}
              >
                {option}
              </button>
            ))}
          </div>

          {timedOut && <p className="challenge-status">Time&apos;s up…</p>}
          {submitting && !timedOut && <p className="challenge-status">Checking your answer…</p>}
        </section>
      )}
    </div>
  );
}
