import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faWrench,
  faMoneyBill,
  faTree,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import Markdown from "react-markdown";
import classNames from "classnames";
import { useState, useEffect } from "react";
import { toggleZoningLayer } from "./Map/util";
import LogoSVG from "./img/logo.svg";

const ZoningContent = ({ markdownString, mapInstance }) => {
  const [zoningVisible, setZoningVisible] = useState(false);

  useEffect(() => {
    if (mapInstance) {
      try {
        const visibility = mapInstance.getLayoutProperty(
          "ga-parcels-tileset-fill-zoning",
          "visibility"
        );
        setZoningVisible(visibility === "visible");
      } catch (err) {
        // Layer might not be loaded yet
      }
    }
  }, [mapInstance]);

  const handleToggleZoning = () => {
    const newVisibility = toggleZoningLayer(mapInstance);
    setZoningVisible(newVisibility);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleToggleZoning}
        className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          zoningVisible
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {zoningVisible ? "Hide Zoning Layer" : "Show Zoning Layer"}
      </button>
      <div>
        <Content markdownString={markdownString} />
      </div>
    </div>
  );
};

const Content = ({ markdownString }) => {
  return (
    <Markdown
      components={{
        h2(props) {
          const { ...rest } = props;
          return <h2 className="font-bold mb-3" {...rest} />;
        },
        // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
        em(props) {
          const { node, ...rest } = props;
          return <i style={{ color: "red" }} {...rest} />;
        },
        a(props) {
          const { ...rest } = props;
          return (
            <a
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              {...rest}
            />
          );
        },
        p(props) {
          const { ...rest } = props;
          return <p className="mb-2" {...rest} />;
        },
        li(props) {
          const { ...rest } = props;
          return <li className="list-disc ml-3" {...rest} />;
        },
      }}
    >
      {markdownString}
    </Markdown>
  );
};

const MapboxTooltip = ({ className, title, children, mapInstance }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isZoning = title === "Zoning";

  const handleTooltipOpen = () => {
    setIsOpen(true);
  };

  const handleTooltipClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="block">
        <div
          className={classNames(
            "inline-block rounded-lg px-2 py-1.5 hover:cursor-pointer z-40 border border-transparent hover:border-gray-400 transition-all duration-200",
            className,
            {
              "shadow-md": isOpen,
            }
          )}
          style={{
            backgroundColor: isOpen ? "#D1D5DB" : "#ECEFF5", // Darker gray when open
          }}
        >
          <div
            className="flex items-center text-nowrap"
            data-tooltip-id={`tooltip-${title}`}
          >
            <div className="mr-1">
              <FontAwesomeIcon
                icon={faHouse}
                className={classNames({
                  "text-gray-700": isOpen,
                  "text-gray-600": !isOpen,
                })}
              />
            </div>
            <span
              className={classNames(
                "text-sm pr-1 font-medium transition-colors duration-200",
                {
                  "text-gray-800": isOpen,
                  "text-gray-700": !isOpen,
                }
              )}
            >
              {title}
            </span>
          </div>
          <Tooltip
            id={`tooltip-${title}`}
            content={
              isZoning ? (
                <ZoningContent
                  markdownString={children}
                  mapInstance={mapInstance}
                />
              ) : (
                <Content markdownString={children} />
              )
            }
            events={["click"]}
            className="z-50 w-96 bg-white text-sm font-normal px-4 py-3 rounded-lg"
            disableStyleInjection
            style={{
              boxShadow: `0px 3px 10px 0px rgba(0, 0, 0, 0.2)`,
            }}
            place="bottom-start"
            afterShow={handleTooltipOpen}
            afterHide={handleTooltipClose}
          />
        </div>
      </div>
    </>
  );
};

export default MapboxTooltip;
