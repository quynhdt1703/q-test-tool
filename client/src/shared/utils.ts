export const inputIntKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement>,
) => {
  if (
    /[a-zA-Z.]/.test(event.key) &&
    [
      'Backspace',
      'Delete',
      'Control',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ].indexOf(event.key) === -1
  ) {
    event.preventDefault();
  }
};
