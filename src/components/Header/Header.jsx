import { motion } from "framer-motion";

import "./header.css";

const Header = () => {
    const text = "Memory Game".split(" ");

    return (
        <h1 className="text-center mt-4 mb-6 text-4xl text-sky-100">
            {text.map((word, i) => (
                <motion.span
                    key={word}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.5,
                        delay: i / 10,
                    }}
                >
                    {word}{" "}
                </motion.span>
            ))}
        </h1>
    );
};

export default Header;