import { t } from 'elysia';

export const NameValue = t.Object({
  name: t.String(),
  value: t.String(),
});

export const DeleteManyDto = t.Object({
  ids: t.Array(t.String()),
});
