export const disabledScroll = () => {
  var body = document.getElementById("scrollbar");
  body.style.overflow = "hidden";
};

export const enabledScroll = () => {
  var body = document.getElementById("scrollbar");
  body.style.overflow = "overlay";
};
