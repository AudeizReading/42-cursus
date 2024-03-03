export interface DataUser {
  id: number;
  name: string;
  avatar: string;
}

export interface DataElement {
  dir: number | Point;
  pos: number | Point;
  speed: number;
  size: number;
  at: number | null;
}

export interface DataGame {
  users: DataUser[];
  points: number[];
  players: DataElement[];
  ball: DataElement;
  ended: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Plane {
  n: Point;
  pos: Point;
  size?: number;
}

export function v_dot(vector1: Point, vector2: Point): number {
  return (vector1.x * vector2.x
    + vector1.y * vector2.y
  );
}

export function v_add(vector1: Point, vector2: Point): Point {
  return ({
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y
  });
}

export function v_sub(vector1: Point, vector2: Point): Point {
  return ({
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y
  });
}

export function v_multiplication(vector1: Point, vector2: Point): Point {
  return ({
    x: vector1.x * vector2.x,
    y: vector1.y * vector2.y
  });
}

export function v_scale(vector1: Point, factor: number): Point {
  return ({
    x: vector1.x * factor,
    y: vector1.y * factor
  });
}

export function v_length(vector: Point): number
{
  return (Math.sqrt(vector.x * vector.x
      + vector.y * vector.y
    ));
}

export function v_norm(vector: Point): Point
{
  const length = v_length(vector);
  if (length > 0.0) {
    const ratio = 1.0 / length;
    vector.x *= ratio;
    vector.y *= ratio;
  }
  return (vector);
}

export function pl_intersect(origin: Point, dest: Point, pl: { n: Point, pos: Point }): number {
  const ray: Point = v_sub(dest, origin);
  const denominator = v_dot(pl.n, ray);
  if (Math.abs(denominator) > 0.0) {
    const pl_cam = v_sub(pl.pos, origin);
    const t = v_dot(pl_cam, pl.n) / denominator;
    if (t >= 0.000001)
      return (t);
  }
  return (-1);
}

export function  pl_time_to_vector(origin: Point, dest: Point, time: number): Point
{
  const ray: Point = v_sub(dest, origin);
  return (v_add(origin, v_scale(ray, time)));
}

export function check_segment_collision(plane: Plane, point: Point): boolean { // not minirt
  // Pour être gentil +/-3 pour la taille de la balle
  return (plane.pos.y <= point.y + 3 && point.y - 3 <= plane.pos.y + (plane.size || 0));
}
