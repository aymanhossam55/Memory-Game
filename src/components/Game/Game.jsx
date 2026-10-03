import {
    useEffect,
    useRef,
    useState,
} from "react";

import "./game.css";

import Category from "../Category/Category";
import CardAmount from "../CardAmount/CardAmount";
import Pace from "../Pace/Pace";

import { createClient } from "pexels";

const client = createClient(
    "UUboF4rkITmKuDkvHUUJGcKMX14tR1GqVfXCys9XqOblSHKAxER1C6Rf"
);

const Queries = [
    "abstract",
    "people",
    "animals",
    "nature",
];

const Paces = [
    "easy",
    "medium",
    "hard",
    "pro",
];

const ATTEMPTS = {
    easy: 20,
    medium: 16,
    hard: 12,
    pro: 8,
};

const shuffleArray = (array) => {
    const shuffled = [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [
            shuffled[i],
            shuffled[j],
        ] = [
            shuffled[j],
            shuffled[i],
        ];
    }

    return shuffled;
};

const Game = () => {
    const [startgame, setStartGame] =
        useState(false);

    const [category, setCategory] =
        useState(Queries[0]);

    const [Amount, setAmount] =
        useState(4);

    const [images, setImages] =
        useState([]);

    const [pace, setPace] =
        useState(Paces[0]);

    const [flippedCards, setFlippedCards] =
        useState([]);

    const [flippedIndices, setFlippedIndices] =
        useState([]);

    const [attempts, setAttempts] =
        useState(ATTEMPTS[Paces[0]]);

    const [result, setResult] =
        useState(null);

    const [finishgame, setFinishGame] =
        useState(false);

    const [matchedIndices, setMatchedIndices] =
        useState([]);

    const [matchingInProgress, setMatchingInProgress] =
        useState(false);

    const [loadingImages, setLoadingImages] =
        useState(false);

    const [imageError, setImageError] =
        useState("");

    const timeoutRef = useRef(null);


    /*
     * Fetch images
     */
    useEffect(() => {
        let cancelled = false;

        const getImages = async () => {
            setLoadingImages(true);
            setImageError("");

            try {
                const photos =
                    await client.photos.search({
                        per_page: Amount,
                        page: 1,
                        query: category,
                    });

                if (cancelled) return;

                if (
                    !photos?.photos?.length
                ) {
                    setImages([]);
                    setImageError(
                        "No images found."
                    );
                    return;
                }

                /*
                 * Every image appears twice
                 * because this is a memory game.
                 */
                const repeatedImages =
                    photos.photos.flatMap(
                        (img) => [img, img]
                    );

                setImages(
                    shuffleArray(
                        repeatedImages
                    )
                );
            } catch (error) {
                if (cancelled) return;

                console.error(
                    "Pexels error:",
                    error
                );

                setImages([]);
                setImageError(
                    "Unable to load images. Please try again."
                );
            } finally {
                if (!cancelled) {
                    setLoadingImages(false);
                }
            }
        };

        /*
         * Only fetch new images while
         * setting up the game.
         */
        if (!startgame) {
            getImages();
        }

        return () => {
            cancelled = true;
        };
    }, [category, Amount, startgame]);


    /*
     * Reset cards whenever the number
     * of cards changes.
     */
    useEffect(() => {
        const totalCards = Amount * 2;

        setFlippedCards(
            Array.from(
                { length: totalCards },
                () => false
            )
        );

        setFlippedIndices([]);
        setMatchedIndices([]);
        setMatchingInProgress(false);
    }, [Amount]);


    /*
     * Start game
     */
    const handleStartGame = () => {
        if (
            loadingImages ||
            images.length === 0
        ) {
            return;
        }

        const shuffledImages =
            shuffleArray(images);

        setImages(shuffledImages);

        setFlippedCards(
            Array.from(
                {
                    length:
                        shuffledImages.length,
                },
                () => false
            )
        );

        setFlippedIndices([]);
        setMatchedIndices([]);

        setMatchingInProgress(false);

        setAttempts(
            ATTEMPTS[pace]
        );

        setResult(null);
        setFinishGame(false);

        setStartGame(true);
    };


    /*
     * Card click
     */
    const handleCardClick = (index) => {
        if (
            finishgame ||
            matchingInProgress ||
            flippedIndices.includes(index) ||
            matchedIndices.includes(index)
        ) {
            return;
        }

        /*
         * Flip selected card
         */
        setFlippedCards(
            (previous) => {
                const newCards = [
                    ...previous,
                ];

                newCards[index] = true;

                return newCards;
            }
        );

        /*
         * First card
         */
        if (
            flippedIndices.length === 0
        ) {
            setFlippedIndices([index]);
            return;
        }

        /*
         * Second card
         */
        const firstIndex =
            flippedIndices[0];

        setFlippedIndices([
            firstIndex,
            index,
        ]);

        setMatchingInProgress(true);

        /*
         * Check if the cards match
         */
        if (
            images[firstIndex]?.id ===
            images[index]?.id
        ) {
            /*
             * Match found
             */
            setMatchedIndices(
                (previous) => [
                    ...previous,
                    firstIndex,
                    index,
                ]
            );

            setFlippedIndices([]);
            setMatchingInProgress(false);

            return;
        }

        /*
         * Cards don't match.
         *
         * Give the user a short time
         * to see both cards.
         */
        timeoutRef.current =
            setTimeout(() => {
                setFlippedCards(
                    (previous) => {
                        const newCards = [
                            ...previous,
                        ];

                        newCards[
                            firstIndex
                        ] = false;

                        newCards[index] = false;

                        return newCards;
                    }
                );

                setFlippedIndices([]);
                setMatchingInProgress(false);

                setAttempts(
                    (previous) => {
                        const remaining =
                            previous - 1;

                        if (
                            remaining <= 0
                        ) {
                            setFinishGame(
                                true
                            );

                            setResult(
                                "You Lose!"
                            );

                            return 0;
                        }

                        return remaining;
                    }
                );
            }, 500);
    };


    /*
     * Check if all cards have been matched
     */
    useEffect(() => {
        if (
            images.length > 0 &&
            matchedIndices.length ===
                images.length
        ) {
            setFinishGame(true);
            setResult("You Win!");
        }
    }, [
        matchedIndices,
        images.length,
    ]);


    /*
     * Cleanup timeout
     */
    useEffect(() => {
        return () => {
            if (
                timeoutRef.current
            ) {
                clearTimeout(
                    timeoutRef.current
                );
            }
        };
    }, []);


    /*
     * Reset game
     */
    const resetGame = () => {
        if (
            timeoutRef.current
        ) {
            clearTimeout(
                timeoutRef.current
            );

            timeoutRef.current = null;
        }

        setStartGame(false);

        setFlippedCards(
            Array.from(
                {
                    length:
                        Amount * 2,
                },
                () => false
            )
        );

        setFlippedIndices([]);
        setMatchedIndices([]);

        setAttempts(
            ATTEMPTS[pace]
        );

        setResult(null);
        setFinishGame(false);
        setMatchingInProgress(false);
    };


    /*
     * SETTINGS SCREEN
     */
    if (!startgame) {
        return (
            <div className="container flex justify-center">
                <div className="game p-2 ps-3">

                    <h2 className="text-2xl font-extrabold text-gray-600 pb-2">
                        Setting
                    </h2>

                    <Category
                        category={category}
                        setCategory={
                            setCategory
                        }
                        Queries={Queries}
                    />

                    <CardAmount
                        Amount={Amount}
                        setAmount={setAmount}
                    />

                    <Pace
                        pace={pace}
                        setPace={setPace}
                        Paces={Paces}
                    />

                    {imageError && (
                        <p className="image-error">
                            {imageError}
                        </p>
                    )}

                    <div className="btn-start flex justify-center mt-4">
                        <button
                            type="button"
                            className="text-center rounded-xl p-2 px-8 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={
                                handleStartGame
                            }
                            disabled={
                                loadingImages ||
                                images.length ===
                                    0
                            }
                        >
                            {loadingImages
                                ? "Loading..."
                                : "Start"}
                        </button>
                    </div>

                </div>
            </div>
        );
    }


    /*
     * GAME SCREEN
     */
    return (
        <>
            <div className="attempts">

                {!finishgame ? (
                    <section className="attempts-box">
                        Attempts:{" "}
                        {attempts}
                    </section>
                ) : (
                    <div className="game-result">

                        <div className="text-white text-2xl font-bold mb-4">
                            {result}
                        </div>

                        <button
                            type="button"
                            className="btn-retry text-white text-2xl font-bold rounded-xl p-4"
                            onClick={
                                resetGame
                            }
                        >
                            Return to Setting
                        </button>

                    </div>
                )}

            </div>


            <div className="card-container">

                {images.map(
                    (img, index) => (
                        <div
                            key={`${img.id}-${index}`}
                            className={`card ${
                                flippedCards[
                                    index
                                ]
                                    ? "flipped"
                                    : ""
                            } ${
                                matchedIndices.includes(
                                    index
                                )
                                    ? "matched"
                                    : ""
                            }`}
                            onClick={() =>
                                handleCardClick(
                                    index
                                )
                            }
                        >
                            <div className="card-face card-front"></div>

                            <div className="card-face card-back">
                                <img
                                    src={
                                        img.src
                                            .medium
                                    }
                                    alt={
                                        img.alt ||
                                        img.photographer
                                    }
                                />
                            </div>
                        </div>
                    )
                )}

            </div>
        </>
    );
};

export default Game;