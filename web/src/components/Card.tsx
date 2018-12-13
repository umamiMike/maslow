import React from "react";

interface Props {
  backgroundImage?: string;
  children?: any;
  alt?: string;
  title: string;
}

function Card(props: Props) {
  let backgroundImage = null;
  if (props.backgroundImage) {
    backgroundImage = (
      <div
        className="h-48 lg:h-auto lg:w-48 bg-blue-lightest flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{
          backgroundImage: `url('/${props.backgroundImage}.png')`
        }}
        title={props.title}
      />
    );
  }
  return (
    <div className="max-w w-full lg:flex p-1 border-r bg-blue-lightest border-b border-l border-grey-light lg:border-l-0 lg:border-t lg:border-grey-light ">
      {backgroundImage}
      <div className="lg:w-64 bg-blue-lightest p-4 flex flex-col justify-between leading-normal">
        <div className="text-black font-bold text-xl mb-2">{props.title}</div>
        {props.children}
      </div>
    </div>
  );
}

export default Card;
