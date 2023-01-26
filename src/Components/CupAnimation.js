import { React, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const CupAnimation = () => {
  const [springs, api] = useSpring(() => ({
    from: {
      backgroundColor: "#f75f48",
      clipPath: `inset(10% 0 0 0)`,
    },
    config: { duration: 1000 },
  }));
  const [springState, setSpringState] = useState([10, 25]);
  const handleClickAnimation = () => {
    api.start({
      from: {
        backgroundColor: "#f75f48",
        clipPath: `inset(${springState[0]}% 0 0 0)`,
      },
      to: {
        backgroundColor: "#f75f48",
        clipPath: `inset(${springState[1]}% 0 0 0)`,
      },
    });

    if (springState[0] > 70) {
      const elem = document.getElementById("secret-message");
      elem.style.display = "block";
    } else {
      setSpringState((prevValues) => [prevValues[0] + 15, prevValues[1] + 15]);
    }
  };

  return (
    <div className="cup-animation">
      <div className="cup">
        <div className="straw" onClick={handleClickAnimation}></div>
        <div className="lid"></div>
        <animated.div
          onClick={handleClickAnimation}
          style={{
            marginLeft: "1px",
            width: "95px",
            height: "198px",
            backgroundColor: "white",
            zIndex: 3,
            ...springs,
          }}
        ></animated.div>
      </div>
      <div className="center-form-items">
        <div
          id="secret-message"
          style={{ display: "none", marginRight: "5em" }}
        >
          Ahh.
        </div>
      </div>
    </div>
  );
};

export default CupAnimation;
