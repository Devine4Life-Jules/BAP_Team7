import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';

export default function Screen1() {
  useEffect(() => {
    function handleKey(e) {
      if (e.code === "Space") {
        route('/screen2');
      };
    }

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  },);

  return (
    <div>
      <p>Screen 1 — press SPACE to continue</p>
    </div>
  );
}
