export const enableStickyObserver = () => {
	const observer = new IntersectionObserver(
		([e]) => {
			(e.target as HTMLElement).dataset.sticky =
				e.intersectionRatio < 1 ? "pinned" : "";
		},
		{ threshold: [1] },
	);

	document
		.querySelectorAll("[data-sticky-observer]")
		.forEach((e) => observer.observe(e));
};