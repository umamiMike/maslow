import React from "react";

interface ParamType {
  id: Number;
}

interface MatchType {
  params: ParamType;
}

interface Props {
  match: MatchType; // From React Router
}

export default function ProjectDetails(props: Props) {
  const id = props.match.params.id;

  return (
    <div className="container section project-details">
      <div className="card z-depth-0">
        <div className="card-content">
          <span className="card-title">Project tile {id}</span>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
            similique tempore eaque sit nihil non, aspernatur obcaecati est
            totam accusamus modi quo doloremque qui fugit tempora officiis
            ratione a minima.
          </p>
        </div>
        <div className="card-action grey lighten-4 grey-text">
          <div>Posted by Peter Banka</div>
          <div>2nd Sept 2:00am</div>
        </div>
      </div>
    </div>
  );
}
