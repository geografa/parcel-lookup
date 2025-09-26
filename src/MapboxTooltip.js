import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import Markdown from "react-markdown";
import classNames from "classnames";
import LogoSVG from "./img/logo.svg";

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

const MapboxTooltip = ({ className, title, children }) => {
  return (
    <>
      <div className="block">
        <div
          className={classNames(
            "inline-block rounded-lg px-2 py-1.5 hover:cursor-pointer z-40 border border-transparent hover:border-gray-400",
            className
          )}
          style={{ backgroundColor: "#ECEFF5" }}
        >
          <div
            className="flex items-center text-nowrap"
            data-tooltip-id={`tooltip-${title}`}
          >
            <div className="mr-1">
              <img src={LogoSVG} alt="Logo" width="14" height="14" />
            </div>
            <span className="text-sm pr-1 font-medium">{title}</span>
          </div>
          <Tooltip
            id={`tooltip-${title}`}
            content={<Content markdownString={children} />}
            events={["click"]}
            className="z-50 w-96 bg-white text-sm font-normal px-4 py-3 rounded-lg"
            disableStyleInjection
            style={{
              boxShadow: `0px 3px 10px 0px rgba(0, 0, 0, 0.2)`,
            }}
            place="bottom-start"
          />
        </div>
      </div>
    </>
  );
};

export default MapboxTooltip;
