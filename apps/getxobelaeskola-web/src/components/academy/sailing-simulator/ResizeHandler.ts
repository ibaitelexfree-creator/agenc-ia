import { WebGLRenderer, PerspectiveCamera } from 'three';

export class ResizeHandler {
    static handleResize(
        width: number,
        height: number,
        renderer: WebGLRenderer,
        camera: PerspectiveCamera
    ) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height, false);
    }

    static observe(
        container: HTMLElement,
        renderer: WebGLRenderer,
        camera: PerspectiveCamera
    ): () => void {
        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries.length) return;
            const { width, height } = entries[0].contentRect;
            this.handleResize(width, height, renderer, camera);
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }
}
