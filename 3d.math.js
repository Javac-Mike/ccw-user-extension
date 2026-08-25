(function (_Scratch) {
    const {ArgumentType, BlockType, Cast, extension, runtime, translate} = _Scratch;

    class Vector3 {
        constructor(x, y, z) {
            this.x = Cast.toNumber(x);
            this.y = Cast.toNumber(y);
            this.z = Cast.toNumber(z);
        }

        add(other) {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            return this;
        }

        sub(other) {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
            return this;
        }

        mul(scalar) {
            const s = Cast.toNumber(scalar);
            this.x *= s;
            this.y *= s;
            this.z *= s;
            return this;
        }

        div(divisor) {
            const d = Cast.toNumber(divisor);
            this.x /= d;
            this.y /= d;
            this.z /= d;
            return this;
        }

        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        dot(other) {
            return this.x * other.x + this.y * other.y + this.z * other.z;
        }

        negate() {
            return this.mul(-1);
        }

        clone() {
            return new Vector3(this.x, this.y, this.z);
        }

        cross(other) {
            return new Vector3(
                this.y * other.z - this.z * other.y,
                this.z * other.x - this.x * other.z,
                this.x * other.y - this.y * other.x
            );
        }

        normalize() {
            const len = this.length();
            this.x /= len;
            this.y /= len;
            this.z /= len;
            return this;
        }
    }

    const matrix4 = {
        perspective(fov, aspect, near, far) {
            const f = 1.0 / Math.tan(Math.PI / 180 * FOV / 2);
            return [
                f / aspect, 0, 0, 0,
                0, f, 0, 0,
                0, 0, -(far + near) / (far - near), -1,
                0, 0, -(2 * far * near) / (far - near), 0
            ];
        },
        lookAt(eye, target, up) {
            const ev = new Vector3(...eye);
            const cv = new Vector3(...target);
            const uv = new Vector3(...up);
            const forward = cv
                .clone()
                .sub(ev)
                .normalize();
            const right = forward
                .clone()
                .cross(uv)
                .normalize();
            const u = right
                .clone()
                .cross(forward);
            return [
                right.x, u.x, -(forward.x), 0,
                right.y, u.y, -(forward.y), 0,
                right.z, u.z, -(forward.z), 0,
                -(right.dot(ev)), -(u.dot(ev)), forward.dot(ev), 1
            ];
        },
        multiply(a, b) {
            const result = [];
            for (let i = 0; i < 16; i++) result.push(0);
            for (let col = 0; col < 4; col++) {
                for (let row = 0; row < 4; row++) {
                    let sum = 0;
                    for (let k = 0; k < 4; k++) {
                        sum += a[row + k * 4] * b[k + col * 4];
                    }
                    result[row + col * 4] = sum;
                }
            }
            return result;
        },
        rotationX (angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return new [
                1, 0, 0, 0,
                0, c, s, 0,
                0, -s, c, 0,
                0, 0, 0, 1
            ];
        },
        rotationY (angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return new [
                c, 0, -s, 0,
                0, 1, 0, 0,
                s, 0, c, 0,
                0, 0, 0, 1
            ];
        },
        rotationZ (angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return new [
                c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        },
    }
})(Scratch);