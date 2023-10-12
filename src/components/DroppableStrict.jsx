import { useEffect, useState } from "react";

import { Droppable } from "react-beautiful-dnd";

function DroppableStrict({ droppableId, children, ...rest }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable droppableId={droppableId} {...rest}>
      {children}
    </Droppable>
  );
}

export default DroppableStrict;
