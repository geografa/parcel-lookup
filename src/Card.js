import numeral from "numeral";
import classNames from "classnames";

export const pluralize = (number, word) => {
  return `${number} ${word}${number === 1 ? "" : "s"} `;
};

export const PropertyData = ({ feature, large = false }) => {
  const { location, USECDDESC_, ImprAppr_1, LandAppr_1 } =
    feature.properties || {};

  const largerTextClass = large ? "text-2xl" : "text-xl";
  const smallerTextClass = large ? "text-base" : "text-sm";
  const xPaddingClass = large ? "p-0" : "p-3";

  return (
    <div className={classNames("py-1.5", xPaddingClass)}>
      <h5
        className={classNames(
          "mb-1.5  font-bold tracking-tight",
          largerTextClass
        )}
      >
        {location || "N/A"}
      </h5>

      <p
        className={classNames(
          "mb-2 font-normal text-gray-600",
          smallerTextClass
        )}
      >
        {`Use: ${USECDDESC_ || "N/A"}`}
      </p>
      <p
        className={classNames(
          "mb-2 font-normal text-gray-600",
          smallerTextClass
        )}
      >
        {`Improved Value: $${ImprAppr_1 || "N/A"}`}
      </p>
      <p
        className={classNames(
          "mb-2 font-normal text-gray-600",
          smallerTextClass
        )}
      >
        {`Land Value: $${LandAppr_1 || "N/A"}`}
      </p>
    </div>
  );
};

const Card = ({ feature, width = "auto", shortImage = false, onClick }) => {
  const handleClick = () => {
    onClick(feature);
  };

  const { imageUrl } = feature.properties || {};

  return (
    <div className="cursor-pointer" onClick={handleClick}>
      <div
        className="bg-white border border-gray-200 rounded-2xl "
        style={{
          width,
          boxShadow: "0px 2px 8px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          className={classNames("bg-cover  m-1.5", {
            "h-44": shortImage,
            "h-52": !shortImage,
          })}
          style={{
            backgroundImage: imageUrl ? `url("${imageUrl}")` : "none",
            backgroundColor: !imageUrl ? "#f3f4f6" : "transparent",
            borderRadius: 11.28,
          }}
        ></div>
        <PropertyData feature={feature} />
      </div>
    </div>
  );
};

export default Card;
