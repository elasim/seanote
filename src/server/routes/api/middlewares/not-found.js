export default function notFound(message) {
	return (req, res) => {
		res.status(404).json({
			error: message
		});
	};
}
