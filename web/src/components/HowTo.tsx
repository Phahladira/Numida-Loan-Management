import "../styles/HowTo.css";
import { memo } from "react";

const HowTo = memo(() => {
  return (
    <div className="how-to-container">
      <h1 className="text">
        How <span>It Works</span>
      </h1>

      <div className="info-container">
        <div className="side-container">
          <img
            width={400}
            src="/Home-and-congrats-Numida-1.png"
            alt="Numida Phone Logo"
          />
        </div>

        <div className="line-div" />

        <div className="side-container">
          <div className="step-container">
            <div className="step">
              <img width={45} src="/download.svg" alt="Download" />
              <h3>STEP 1:</h3>
              <p>
                DOWNLOAD <br /> NUMIDA APP <br /> FROM PLAY <br /> STORE
              </p>
            </div>
            <div className="step">
              <img width={50} src="/passport.svg" alt="Passport" />
              <h3>STEP 2:</h3>
              <p>
                PROVIDE YOUR <br /> NATIONAL ID <br /> PHOTO
              </p>
            </div>
          </div>
          <div className="step-container">
            <div className="step">
              <img width={45} src="/menu.svg" alt="Menu" className="" />
              <h3>STEP 3:</h3>
              <p>
                SHARE BASIC <br />
                DETAILS ABOUT <br />
                YOUR BUSINESS
              </p>
            </div>
            <div className="step">
              <img width={45} src="/24.svg" alt="24 Hours" className="" />
              <h3>STEP 4:</h3>
              <p>
                RECEIVE THE <br />
                LOAN WITHIN 24 <br />
                HOURS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HowTo;
