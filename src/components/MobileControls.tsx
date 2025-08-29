// MobileControles.tsx
'use client';

interface KeysPressedRef {
  current: {
    left: boolean;
    right: boolean;
  };
}

interface PlayerRef {
  current: {
    velocity: {
      x: number;
      y: number;
    };
    isJumping: boolean;
  };
}

interface MobileControlesProps {
  keysPressedRef: KeysPressedRef;
  playerRef: PlayerRef;
}

export const MobileControls = ({
  keysPressedRef,
  playerRef,
}: MobileControlesProps) => {
  const handleJump = () => {
    if (!playerRef.current.isJumping) {
      playerRef.current.velocity.y = -12; // JUMP_FORCE
      playerRef.current.isJumping = true;
    }
  };

  return (
    <div className="absolute right-0 bottom-4 left-0 flex justify-center space-x-8">
      <button
        className="bg-opacity-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white"
        onTouchStart={() => (keysPressedRef.current.left = true)}
        onTouchEnd={() => (keysPressedRef.current.left = false)}
      >
        ←
      </button>
      <button
        className="bg-opacity-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white"
        onTouchStart={handleJump}
      >
        ↑
      </button>
      <button
        className="bg-opacity-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white"
        onTouchStart={() => (keysPressedRef.current.right = true)}
        onTouchEnd={() => (keysPressedRef.current.right = false)}
      >
        →
      </button>
    </div>
  );
};
