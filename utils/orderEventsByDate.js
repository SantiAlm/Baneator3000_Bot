function orderByDate(events){
    return events.sort((a, b) => {
        return new Date(`${a.date.year}/${a.date.month}/${a.date.day}`) - new Date(`${b.date.year}/${b.date.month}/${b.date.day}`);
    });
}

module.exports = orderByDate;