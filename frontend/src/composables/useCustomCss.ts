import {computed, watch} from 'vue'
import {createSharedComposable, tryOnMounted} from '@vueuse/core'
import {useConfigStore} from '@/stores/config'

const STYLE_ELEMENT_ID = 'instance-custom-css'

export const useCustomCss = createSharedComposable(() => {
	const configStore = useConfigStore()
	const customCss = computed(() => configStore.customCss ?? '')

	function apply(css: string) {
		const body = window?.document?.body
		if (!body) {
			return
		}

		let styleElement = body.querySelector<HTMLStyleElement>(`#${STYLE_ELEMENT_ID}`)

		if (css === '') {
			styleElement?.remove()
			return
		}

		if (styleElement === null) {
			styleElement = document.createElement('style')
			styleElement.id = STYLE_ELEMENT_ID
			// In body, not head: lazily loaded route CSS chunks are appended to head after mount and would
			// otherwise win over the configured rules at equal specificity.
			body.append(styleElement)
		}

		styleElement.textContent = css
	}

	watch(customCss, apply, {flush: 'post'})
	tryOnMounted(() => apply(customCss.value))
})
