import React from "react";

function Modal(props) {
  const { show, closeModal } = props;

  return (
    <>
      <div className={show ? "modal" : "hide"}>
        <button className="button-closeModal" onClick={closeModal}>X</button>
        <h3>Play with friend</h3>
      </div>
    </>
  );
}

export default Modal;