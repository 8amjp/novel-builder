'use strict';
const fs = require('fs-extra');
const path = require('path');
const mustache = require('mustache');
const JpWrap = require('jp-wrap');
const wrap = new JpWrap(40, {
    trim: false,
    fullWidthSpace: false,
    sameWidth: true,
});
const reportTemplatePath = '../templates/report/';
const filename = 'report.html';

module.exports = class Reporter {
    constructor(contents) {
        this.contents = contents;
    }

    // 文字数などの計算
    report() {
        return Promise.all(
            this.contents.map(content => {
                return this.analyze(content);
            })
        )
            .then(data => {
                return this.output(data);
            })
            .then(() => {
                return Promise.resolve();
            })
            .catch(err => {
                console.dir(err);
            });
    }

    //
    analyze(content) {
        return new Promise((resolve, reject) => {
            let str = content.data.trim();
            let lines = str.split('\n');
            let manuscriptlines = wrap(
                str
                    .replace(/ /g, '')
                    .replace(/《(.+?)》/g, '')
                    .replace(/[\|｜]/g, '')
            ).split('\n').length;
            // ruby, numerals
            let rubytexts = [];
            let numerals = [];
            let alphabets = [];
            let rubyPattern = /｜[^《]+?《.+?》/g;
            let numeralsPattern = /\d+/g;
            let alphabetsPattern = /[a-zA-Z&,.]+/g;
            let result;
            while ((result = rubyPattern.exec(str)) !== null) {
                rubytexts.push(result[0]);
            }
            while ((result = numeralsPattern.exec(str)) !== null) {
                numerals.push(result[0]);
            }
            while ((result = alphabetsPattern.exec(str)) !== null) {
                alphabets.push(result[0]);
            }
            resolve({
                name: content.name,
                // 半角スペースおよび改行を除いた文字数
                chars1: str.replace(/ \f\n\r\t\v/g, '').length,
                // さらに全角スペースを除いた文字数
                chars2: str.replace(/\s/g, '').length,
                // さらにルビ文字を除いた文字数
                chars3: str
                    .replace(/\s/g, '')
                    .replace(/《(.+?)》/g, '')
                    .replace(/[\|｜]/g, '').length,
                // さらに章タイトルを除いた文字数
                chars4: str
                    .replace(/^#.*/m, '')
                    .replace(/\s/g, '')
                    .replace(/《(.+?)》/g, '')
                    .replace(/[\|｜]/g, '').length,
                // 行数
                lines: lines.length,
                // 台詞(鉤括弧で始まる行)の行数
                quotelines: lines.filter(line =>
                    new RegExp(/^[「『]/).test(line)
                ).length,
                // 地の文(全角スペースで始まる行)の行数
                descriptivelines: lines.filter(line =>
                    new RegExp(/^　/).test(line)
                ).length,
                // その他の文字で始まる行数
                otherlines: lines.filter(line =>
                    new RegExp(/^[^「『　]/).test(line)
                ).length,
                // 空白の行数
                emptylines: lines.filter(line => line.length == 0).length,
                // 原稿用紙換算行数
                manuscriptlines: manuscriptlines,
                // 原稿用紙換算枚数
                manuscriptpages: Math.floor(manuscriptlines / 20),
                // 原稿用紙換算枚数剰余行数
                manuscriptmodlines: manuscriptlines % 20,
                // ルビ文字
                rubytexts: rubytexts.map(value => {
                    return {
                        text: value,
                    };
                }),
                // 半角数字
                numerals: numerals.map(value => {
                    return {
                        numeral: value,
                    };
                }),
                alphabets: alphabets.map(value => {
                    return {
                        alphabet: value,
                    };
                }),
            });
        });
    }

    // 出力
    output(data) {
        let lines = data
            .map(file => file.lines)
            .reduce((acc, cur) => acc + cur);
        let quotelines = data
            .map(file => file.quotelines)
            .reduce((acc, cur) => acc + cur);
        let descriptivelines = data
            .map(file => file.descriptivelines)
            .reduce((acc, cur) => acc + cur);
        let otherlines = data
            .map(file => file.otherlines)
            .reduce((acc, cur) => acc + cur);
        let manuscriptlines = data
            .map(file => file.manuscriptlines)
            .reduce((acc, cur) => acc + cur);
        let emptylines = data
            .map(file => file.emptylines)
            .reduce((acc, cur) => acc + cur);

        let view = {
            name: process.env.npm_package_name,
            chars1: data
                .map(file => file.chars1)
                .reduce((acc, cur) => acc + cur)
                .toLocaleString(),
            chars2: data
                .map(file => file.chars2)
                .reduce((acc, cur) => acc + cur)
                .toLocaleString(),
            chars3: data
                .map(file => file.chars3)
                .reduce((acc, cur) => acc + cur)
                .toLocaleString(),
            chars4: data
                .map(file => file.chars4)
                .reduce((acc, cur) => acc + cur)
                .toLocaleString(),

            lines: lines.toLocaleString(),
            quotelines: quotelines.toLocaleString(),
            descriptivelines: descriptivelines.toLocaleString(),
            otherlines: otherlines.toLocaleString(),
            emptylines: emptylines.toLocaleString(),

            emptyratio: Math.floor((emptylines / lines) * 1000) / 10,
            quoteratio: Math.floor((quotelines / lines) * 1000) / 10,
            descriptiveratio:
                Math.floor((descriptivelines / lines) * 1000) / 10,
            otherratio: Math.floor((otherlines / lines) * 1000) / 10,

            manuscript: {
                nobreak: {
                    lines: manuscriptlines.toLocaleString(),
                    pages: Math.floor(manuscriptlines / 20).toLocaleString(),
                    modlines: (manuscriptlines % 20).toLocaleString(),
                },
                break: {
                    lines: (manuscriptlines + data.length - 1).toLocaleString(),
                    pages: Math.floor(
                        (manuscriptlines + data.length - 1) / 20
                    ).toLocaleString(),
                    modlines: (
                        (manuscriptlines + data.length - 1) %
                        20
                    ).toLocaleString(),
                },
            },
            details: data.map(file => {
                return {
                    name: file.name,
                    chars1: file.chars1.toLocaleString(),
                    chars2: file.chars2.toLocaleString(),
                    chars3: file.chars3.toLocaleString(),
                    chars4: file.chars4.toLocaleString(),

                    lines: file.lines.toLocaleString(),
                    emptylines: file.emptylines.toLocaleString(),
                    quotelines: file.quotelines.toLocaleString(),
                    descriptivelines: file.descriptivelines.toLocaleString(),
                    otherlines: file.otherlines.toLocaleString(),

                    emptyratio:
                        Math.floor((file.emptylines / file.lines) * 1000) / 10,
                    quoteratio:
                        Math.floor((file.quotelines / file.lines) * 1000) / 10,
                    descriptiveratio:
                        Math.floor(
                            (file.descriptivelines / file.lines) * 1000
                        ) / 10,
                    otherratio:
                        Math.floor((file.otherlines / file.lines) * 1000) / 10,

                    manuscriptlines: file.manuscriptlines.toLocaleString(),
                    manuscriptpages: file.manuscriptpages.toLocaleString(),
                    manuscriptmodlines: file.manuscriptmodlines.toLocaleString(),

                    rubytexts: file.rubytexts,
                    numerals: file.numerals,
                    alphabets: file.alphabets,
                };
            }),
        };
        fs.readFile(
            path.join(__dirname, reportTemplatePath, filename),
            'utf8',
            (err, data) => {
                if (err) return Promise.reject(err);
                return fs.outputFile(filename, mustache.render(data, view));
            }
        );
    }
};
