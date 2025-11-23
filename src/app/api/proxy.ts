export async function GET() {
    const res = await fetch('http://192.168.221.97:8000/latest_state/');
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}
