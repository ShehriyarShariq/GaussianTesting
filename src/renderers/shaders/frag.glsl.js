/*
    from https://github.com/antimatter15/splat/blob/main/main.js
*/

export const frag = /* glsl */ `
precision highp float;

uniform highp usampler2D u_texture;
uniform highp usampler2D u_stencil_texture;

in vec4 vColor;
in vec2 vPosition;

out vec4 fragColor;

void main () {
    float A = -dot(vPosition, vPosition);
    if (A < -4.0) discard;
    float B = exp(A) * vColor.a;
    fragColor = vec4(B * vColor.rgb, B);
}
`
