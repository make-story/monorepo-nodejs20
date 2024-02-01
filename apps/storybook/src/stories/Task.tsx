/**
 * https://storybook.js.org/tutorials/intro-to-storybook/react/en/simple-component/
 */
import React from 'react';

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}: {
  task?: any;
  onArchiveTask?: any;
  onPinTask?: any;
}) {
  return (
    <div className='list-item'>
      {state}
      <label htmlFor='title' aria-label={title}>
        <input type='text' value={title} readOnly={true} name='title' />
      </label>
    </div>
  );
}
