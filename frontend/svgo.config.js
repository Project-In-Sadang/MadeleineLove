module.exports = {
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    removeViewBox: false,
                },
            },
        },
        'removeDimensions',
        {
            name: 'addAttributesToSVGElement',
            params: {
                attributes: [{ fill: 'currentColor' }],
            },
        },
    ],
};
