
async function findPets(ctx, next) {
  ctx.response.body = 'success';
}

module.exports = {
  findPets,
};
