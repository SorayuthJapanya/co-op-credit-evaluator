import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  locale?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  duration = 1.5,
  suffix = "",
  prefix = "",
  locale = true,
  className,
}) => {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => {
    const n = Math.round(v);
    return `${prefix}${locale ? n.toLocaleString("th-TH") : n}${suffix}`;
  });

  // re-animate ทุกครั้งที่ `to` เปลี่ยน (เช่น filter เปลี่ยน)
  const prevTo = useRef<number>(0);

  useEffect(() => {
    const controls = animate(motionVal, to, {
      duration,
      ease: [0.16, 1, 0.3, 1], // expo out — เร็วแรก ค่อยๆ หยุด
      onComplete: () => {
        prevTo.current = to;
      },
    });
    return controls.stop;
  }, [to, duration, motionVal]);

  return <motion.span className={className}>{rounded}</motion.span>;
};
