# Golden Orb Explorer

Take access from me of this github repo - https://github.com/tog223899-tech/office-portal.git 

so that u can commit changes directly - commit all changes 

then start with this - 

Once the gate intro finishes, spawn GuideObject.tsx: a soft glowing orb in the

brand's amber/gold accent color, emerging visibly from within the interior

(e.g. rising from behind the reception desk) — not fading in from nothing.

The moment it emerges: unlock scroll and show a subtle "scroll to explore" cue.

Define a CatmullRomCurve3 path through the interior that maps to the EXISTING

section order (Hero/Lobby → Who We Are/cabins → What We Do/workstation aisle →

Products/a workstation with monitors → process steps/meeting room → testimonials

or case content/breakout wall → final CTA/lounge or back to reception).

Create one page-spanning ScrollTrigger (scrub: 1) mapping scroll progress 0→1 to

curve.getPointAt(progress) for both camera and guide, camera trailing the guide.

Lerp everything in useFrame — no snapping.

At each existing section, the guide should pause near the relevant part of the

interior while that section's existing content (already built, don't rewrite it)

reveals as an HTML overlay on top of the 3D scene.

Run ScrollTrigger.refresh() after load and on resize.

Test: guide/camera path stays in sync with scroll at all speeds, existing section

content still reveals correctly, no jank or console errors.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0839feaa-a667-4c73-abc2-4d5b71a98ce3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
