import React from "react";

const Card = (props) => {
  let { hero, baseURL } = props;
  return (
    <div className="scantist_card">
      <div className="scantist_card_wrapper">
        <div className="scantist_card_img">
          <img
            src={`${baseURL}${hero.img}`}
            alt={`${hero.name}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/252x142/09f/fff.png";
            }}
          />
        </div>
        <div className="scantist_card_details">
          <div className="scantist_card_details--title">
            <h4>{hero.name}</h4>
          </div>
          <div className="divider"></div>
          <div className="scantist_card_details--counts">
            <p style={{ flex: "1" }}>
              Pick:{" "}
              <span className="scantist_card_details--black">
                {hero.pro_pick}
              </span>
            </p>
            <p>
              Ban:{" "}
              <span className="scantist_card_details--black">
                {hero.pro_ban}
              </span>
            </p>
          </div>
          <p>
            Win:
            <span className="scantist_card_details--red">
              {" "}
              {((hero.pro_win / hero.pro_pick) * 100).toFixed(2)}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
