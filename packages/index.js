import CameraPoster from "./components/CameraPoster";
import CameraInput from "./components/CameraInput";

CameraPoster.install = Vue => {
  Vue.component(CameraPoster.name, CameraPoster);
};

export { CameraInput, CameraPoster };
