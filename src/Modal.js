import numeral from "numeral";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { pluralize } from "./Card";
import StaticMapImage from "./StaticMap";
import { PropertyData } from "./Card";

const Modal = ({ feature, onClose }) => {
  // based on the feature clicked, get coordinates and imageUrl
  const [lng, lat] = feature.geometry?.coordinates || [0, 0];
  const { imageUrl } = feature.properties || {};

  return (
    <>
      {/* gray out background */}
      <div className="justify-center items-start flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        {/* modal outer container */}
        <div
          className=" shadow-lg absolute flex flex-col px-3 "
          style={{
            width: 550,
            maxWidth: "100%",
          }}
        >
          {/* modal inner container */}
          <div className="bg-white outline-none focus:outline-none overflow-scroll rounded-2xl my-12 relative">
            <div className="absolute top-0 right-0 m-6">
              <button
                className="z-50 h-8 w-8 bg-gray-100 hover:bg-gray-200 flex justify-center items-center rounded-md "
                onClick={onClose}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size="lg"
                  className="text-gray-500"
                />
              </button>
            </div>
            <div
              className="bg-cover h-80 lg:h-80 "
              style={{
                backgroundImage: imageUrl ? `url("${imageUrl}")` : "none",
                backgroundColor: !imageUrl ? "#f3f4f6" : "transparent",
              }}
            />
            <div className="p-6">
              <PropertyData feature={feature} large />
              {/* <p className="mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                sed erat rutrum, eleifend sem eu, blandit nisi. Nullam finibus
                aliquet nisi nec pharetra. Ut suscipit laoreet est. Cras
                fringilla justo in rutrum commodo. Nam vehicula lectus id
                condimentum lacinia.
              </p> */}
              <div>
                <div className="relative">
                  <StaticMapImage lng={lng} lat={lat} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Modal;
