export function helloWorld() {
    document.getElementById('hello-world')!.addEventListener('click', () => {
        alert('Hello, World!');
    });
}