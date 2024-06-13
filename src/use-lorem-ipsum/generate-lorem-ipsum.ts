// prettier-ignore
const words =
  'lorem_ipsum_dolor_sit_amet_consectetur_adipiscing_elit_sed_do_eiusmod_tempor_incididunt_ut_labore_et_dolore_magna_aliqua_ut_enim_ad_minim_veniam_quis_nostrud_exercitation_ullamco_laboris_nisi_aliquip_ex_ea_commodo_consequat_duis_aute_irure_in_reprehenderit_voluptate_velit_esse_cillum_eu_fugiat_nulla_pariatur_excepteur_sint_occaecat_cupidatat_non_proident_sunt_culpa_qui_officia_deserunt_mollit_anim_id_est_laborum'.split(
    '_',
  )
const defaultEnds = ['.', '!', '?']
const commaChance = 0.1

const pickRandom = (array: string[]) => array[Math.floor(Math.random() * array.length)]

export function generateLoremIpsum(length = 1, sentenceEnds = defaultEnds): string {
  const generateSentence = () => {
    const length = Math.floor(Math.random() * 6) + 6

    const sentence = Array.from({ length })
      .flatMap((_, idx) => {
        const isHeadOrTail = [0, 1, length - 2, length - 1].includes(idx)
        const change = isHeadOrTail ? 0 : commaChance
        return Math.random() < change ? [pickRandom(words), ','] : pickRandom(words)
      })
      .join(' ')
      .replaceAll(' , ', ', ')

    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + pickRandom(sentenceEnds)
  }

  return Array.from({ length }, generateSentence).join(' ')
}
