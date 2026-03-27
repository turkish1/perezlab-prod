<script setup>
import { nextTick, reactive, ref } from 'vue';

const props = defineProps({
    title: { type: String, default: 'Ledger' },
    subtitle: { type: String, default: 'Prepared by / Date / Page' }
});

// Grid dimensions
const rows = 20;
const cols = 8;

// 2D grid data
const grid = reactive(Array.from({ length: rows }, () => Array.from({ length: cols }, () => '')));

const activeCell = ref(null);

function setActive(row, col) {
    activeCell.value = { row, col };
}

function focusCell(row, col) {
    nextTick(() => {
        const el = document.querySelector(`[data-cell="${row}-${col}"]`);
        if (el) el.focus();
    });
}

function handleKey(e, row, col) {
    let r = row;
    let c = col;

    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            r = Math.max(0, row - 1);
            focusCell(r, c);
            break;

        case 'ArrowDown':
            e.preventDefault();
            r = Math.min(rows - 1, row + 1);
            focusCell(r, c);
            break;

        case 'ArrowLeft':
            e.preventDefault();
            c = Math.max(0, col - 1);
            focusCell(r, c);
            break;

        case 'ArrowRight':
            e.preventDefault();
            c = Math.min(cols - 1, col + 1);
            focusCell(r, c);
            break;

        case 'Enter':
            e.preventDefault();
            r = Math.min(rows - 1, row + 1);
            focusCell(r, c);
            break;

        case 'Tab':
            e.preventDefault();
            c = Math.min(cols - 1, col + 1);
            focusCell(r, c);
            break;

        default:
            break;
    }
}

function handleInput(e, row, col) {
    // contenteditable emits text including newlines sometimes; normalize
    const text = (e.target.innerText || '').replace(/\n/g, '');
    grid[row][col] = text;
}
</script>

<template>
    <div class="ledger-wrap">
        <div class="ledger-paper" role="document" aria-label="Ledger sheet">
            <!-- Binder holes -->
            <div class="holes" aria-hidden="true">
                <span class="hole h1" />
                <span class="hole h2" />
                <span class="hole h3" />
            </div>

            <!-- Header content (optional) -->
            <div class="header">
                <div class="header-left">
                    <div class="header-title">{{ props.title }}</div>
                    <div class="header-sub">{{ props.subtitle }}</div>
                </div>
                <div class="header-boxes" aria-hidden="true">
                    <div class="box" />
                    <div class="box" />
                    <div class="box" />
                </div>
            </div>

            <!-- Excel-like grid area -->
            <div class="body">
                <div class="excel-grid" role="grid" aria-label="Editable ledger grid">
                    <div v-for="(rowData, rowIndex) in grid" :key="rowIndex" class="row" role="row">
                        <div
                            v-for="(cell, colIndex) in rowData"
                            :key="colIndex"
                            class="cell"
                            role="gridcell"
                            contenteditable="true"
                            spellcheck="false"
                            :data-cell="`${rowIndex}-${colIndex}`"
                            @focus="setActive(rowIndex, colIndex)"
                            @keydown="handleKey($event, rowIndex, colIndex)"
                            @input="handleInput($event, rowIndex, colIndex)"
                        >
                            {{ cell }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Wrapper (just for centering / viewing) */
.ledger-wrap {
    display: flex;
    justify-content: center;
    padding: 24px;
    background: #101214;
}

/* Paper */
.ledger-paper {
    position: relative;
    width: min(980px, 96vw);
    aspect-ratio: 8.5 / 11; /* US letter vibe */
    border-radius: 6px;
    background: linear-gradient(#ffffff, #ffffff) padding-box;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    overflow: hidden;

    --paper: #fbfbf7;
    --grid: rgba(46, 139, 87, 0.23);
    --grid-strong: rgba(46, 139, 87, 0.32);
    --red: rgba(160, 60, 90, 0.55);
    --red-strong: rgba(160, 60, 90, 0.75);

    background-color: var(--paper);
}

/* GRID BACKGROUND */
.ledger-paper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(to bottom, transparent 0, transparent 11px, var(--grid) 11px, var(--grid) 12px), repeating-linear-gradient(to right, transparent 0, transparent 11px, var(--grid) 11px, var(--grid) 12px),
        repeating-linear-gradient(to bottom, transparent 0, transparent 71px, var(--grid-strong) 71px, var(--grid-strong) 73px), repeating-linear-gradient(to right, transparent 0, transparent 71px, var(--grid-strong) 71px, var(--grid-strong) 73px);
    pointer-events: none;
}

/* RED LEDGER LINES */
.ledger-paper::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
        linear-gradient(var(--red-strong), var(--red-strong)) 18px 18px / calc(100% - 36px) 2px no-repeat,
        linear-gradient(var(--red-strong), var(--red-strong)) 18px calc(100% - 20px) / calc(100% - 36px) 2px no-repeat,
        linear-gradient(var(--red-strong), var(--red-strong)) 18px 18px / 2px calc(100% - 38px) no-repeat,
        linear-gradient(var(--red-strong), var(--red-strong)) calc(100% - 20px) 18px / 2px calc(100% - 38px) no-repeat,
        linear-gradient(var(--red), var(--red)) 90px 18px / 2px calc(100% - 38px) no-repeat,
        linear-gradient(var(--red), var(--red)) calc(100% - 70px) 18px / 2px calc(100% - 38px) no-repeat,
        repeating-linear-gradient(to right, transparent 0, transparent 145px, var(--red) 145px, var(--red) 147px),
        repeating-linear-gradient(to bottom, transparent 0, transparent 155px, var(--red) 155px, var(--red) 157px);
    mix-blend-mode: multiply;
    opacity: 0.9;
    pointer-events: none;
}

/* Header area */
.header {
    position: relative;
    z-index: 1;
    height: 90px;
    padding: 18px 22px 10px 22px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.header-title {
    font:
        700 18px/1.1 ui-sans-serif,
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
    color: rgba(0, 0, 0, 0.55);
    letter-spacing: 0.2px;
}

.header-sub {
    margin-top: 6px;
    font:
        500 12px/1.2 ui-sans-serif,
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
    color: rgba(0, 0, 0, 0.45);
}

.header-boxes {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    padding-right: 76px;
}
.box {
    width: 70px;
    height: 26px;
    border: 2px solid rgba(46, 139, 87, 0.28);
    background: rgba(255, 255, 255, 0.35);
}

/* Content body area */
.body {
    position: relative;
    z-index: 1;
    height: calc(100% - 90px);
    padding: 10px 90px 26px 22px;
    overflow: auto; /* allow scrolling if grid is big */
}

/* Binder holes */
.holes {
    position: absolute;
    top: 0;
    right: 18px;
    width: 44px;
    height: 100%;
    z-index: 2;
    display: block;
}
.hole {
    position: absolute;
    right: 0;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: radial-gradient(circle at 35% 35%, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.18));
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.55),
        inset 0 -2px 4px rgba(0, 0, 0, 0.18);
}
.h1 {
    top: 92px;
}
.h2 {
    top: 50%;
    transform: translateY(-50%);
}
.h3 {
    bottom: 92px;
}

/* Optional paper speckle */
.ledger-paper {
    background-image: radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px);
    background-size:
        22px 22px,
        28px 28px;
    background-position:
        0 0,
        12px 10px;
}

/* ===== Excel-like grid styles ===== */
.excel-grid {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
}

.cell {
    width: 110px;
    height: 28px;
    padding: 4px 6px;
    font:
        500 13px ui-sans-serif,
        system-ui;
    outline: none;
    border: 1px solid rgba(46, 139, 87, 0.15);
    background: rgba(255, 255, 255, 0.6);
    cursor: text;
    overflow: hidden;
    white-space: nowrap;
}

.cell:focus {
    border: 2px solid rgba(46, 139, 87, 0.7);
    background: #fff;
}
</style>

<!-- <script setup lang="ts">
type Props = {
    title?: string;
    subtitle?: string;
};
const props = withDefaults(defineProps<Props>(), {
    title: 'Ledger',
    subtitle: 'Prepared by / Date / Page'
});
</script> -->

<!-- <template>
    <div class="ledger-wrap">
        <div class="ledger-paper" role="document" aria-label="Ledger sheet">

            <div class="holes" aria-hidden="true">
                <span class="hole h1" />
                <span class="hole h2" />
                <span class="hole h3" />
            </div>

             <div class="header">
                <div class="header-left">
                    <div class="header-title">{{ props.title }}</div>
                    <div class="header-sub">{{ props.subtitle }}</div>
                </div>
                <div class="header-boxes" aria-hidden="true">
                    <div class="box" />
                    <div class="box" />
                    <div class="box" />
                </div>
            </div>

             <div class="body">
                <slot />
            </div>
        </div>
    </div>
</template>
 -->

<!-- <style scoped>
/* Wrapper (just for centering / viewing) */
.ledger-wrap {
    display: flex;
    justify-content: center;
    padding: 24px;
    background: #101214;
}

/* Paper */
.ledger-paper {
    position: relative;
    width: min(980px, 96vw);
    aspect-ratio: 8.5 / 11; /* US letter vibe */
    border-radius: 6px;
    background:
    /* red outer frame */ linear-gradient(#ffffff, #ffffff) padding-box;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    overflow: hidden;

    /* tweak these to match your photo */
    --paper: #fbfbf7;
    --grid: rgba(46, 139, 87, 0.23); /* light green */
    --grid-strong: rgba(46, 139, 87, 0.32); /* slightly stronger green */
    --red: rgba(160, 60, 90, 0.55); /* ledger red */
    --red-strong: rgba(160, 60, 90, 0.75);

    background-color: var(--paper);
}

/* GRID BACKGROUND (green small squares + slightly stronger lines) */
.ledger-paper::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
    /* small horizontal grid */
        repeating-linear-gradient(to bottom, transparent 0, transparent 11px, var(--grid) 11px, var(--grid) 12px),
        /* small vertical grid */ repeating-linear-gradient(to right, transparent 0, transparent 11px, var(--grid) 11px, var(--grid) 12px),
        /* stronger horizontal lines every ~6 rows */ repeating-linear-gradient(to bottom, transparent 0, transparent 71px, var(--grid-strong) 71px, var(--grid-strong) 73px),
        /* stronger vertical lines every ~6 cols */ repeating-linear-gradient(to right, transparent 0, transparent 71px, var(--grid-strong) 71px, var(--grid-strong) 73px);
    pointer-events: none;
}

/* RED LEDGER LINES (margins + column dividers + big bands) */
.ledger-paper::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
    /* outer border */
        linear-gradient(var(--red-strong), var(--red-strong)) 18px 18px / calc(100% - 36px) 2px no-repeat,
        linear-gradient(var(--red-strong), var(--red-strong)) 18px calc(100% - 20px) / calc(100% - 36px) 2px no-repeat,
        linear-gradient(var(--red-strong), var(--red-strong)) 18px 18px / 2px calc(100% - 38px) no-repeat,
        linear-gradient(var(--red-strong), var(--red-strong)) calc(100% - 20px) 18px / 2px calc(100% - 38px) no-repeat,
        /* left “ledger margin” vertical red line */ linear-gradient(var(--red), var(--red)) 90px 18px / 2px calc(100% - 38px) no-repeat,
        /* right “index” column line (near holes) */ linear-gradient(var(--red), var(--red)) calc(100% - 70px) 18px / 2px calc(100% - 38px) no-repeat,
        /* periodic vertical red columns (like the photo’s red structure) */ repeating-linear-gradient(to right, transparent 0, transparent 145px, var(--red) 145px, var(--red) 147px),
        /* periodic horizontal red bands */ repeating-linear-gradient(to bottom, transparent 0, transparent 155px, var(--red) 155px, var(--red) 157px);
    mix-blend-mode: multiply;
    opacity: 0.9;
    pointer-events: none;
}

/* Header area */
.header {
    position: relative;
    z-index: 1;
    height: 90px;
    padding: 18px 22px 10px 22px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.header-title {
    font:
        700 18px/1.1 ui-sans-serif,
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
    color: rgba(0, 0, 0, 0.55);
    letter-spacing: 0.2px;
}

.header-sub {
    margin-top: 6px;
    font:
        500 12px/1.2 ui-sans-serif,
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
    color: rgba(0, 0, 0, 0.45);
}

/* little boxes at bottom-right like some ledger forms */
.header-boxes {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    padding-right: 76px; /* keep clear of holes */
}
.box {
    width: 70px;
    height: 26px;
    border: 2px solid rgba(46, 139, 87, 0.28);
    background: rgba(255, 255, 255, 0.35);
}

/* Content body area */
.body {
    position: relative;
    z-index: 1;
    height: calc(100% - 90px);
    padding: 10px 90px 26px 22px; /* right padding leaves space for holes */
}

/* Binder holes */
.holes {
    position: absolute;
    top: 0;
    right: 18px;
    width: 44px;
    height: 100%;
    z-index: 2;
    display: block;
}
.hole {
    position: absolute;
    right: 0;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: radial-gradient(circle at 35% 35%, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.18));
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.55),
        inset 0 -2px 4px rgba(0, 0, 0, 0.18);
}
.h1 {
    top: 92px;
}
.h2 {
    top: 50%;
    transform: translateY(-50%);
}
.h3 {
    bottom: 92px;
}

 .ledger-paper {
    background-image: radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px);
    background-size:
        22px 22px,
        28px 28px;
    background-position:
        0 0,
        12px 10px;
}
</style> -->
